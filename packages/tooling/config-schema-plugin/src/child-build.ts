import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/**
 * Builds a Node-targeted bundle that runs a module's `startupApp()`.
 *
 * Deliberately a second compilation rather than a separate bundler such as esbuild: a module's
 * entry point uses `require.context`, its own `resolve.alias` entries and whatever loaders it has
 * configured, and reusing the compilation its build already describes is the only way to get all of
 * that right without reimplementing it.
 */

/** The parts of a `Compiler` this needs, typed structurally so one implementation serves both bundlers. */
export interface BundlerCompiler {
  options: Record<string, any>;
  rspack?: unknown;
  webpack?: unknown;
}

export interface ChildBuildOptions {
  /** The module's package root. */
  root: string;
  /** The module's entry point, as the bundler config computes it from `package.json`. */
  srcFile: string;
  /** The module's `config-validators` file, if it has one. */
  authoredValidatorsFile?: string;
}

export interface ChildBuildResult {
  /** The built bundle, ready to be loaded by the runner. */
  bundlePath: string;
  /**
   * The temporary directory holding the bundle. The caller removes it once the runner has finished
   * with it, and not before: the runner loads the bundle from there, and its async chunks with it.
   */
  outputDirectory: string;
}

const pluginName = 'OpenmrsConfigSchemaPlugin';

/**
 * How long to allow the child compilation, which is a full Node-target build of the module.
 *
 * Generous, because it bounds a compilation rather than anything interactive: it is here to turn a
 * compiler that never calls back into a diagnosable error, not to police slow builds. Running the
 * module afterwards is bounded separately and much more tightly, since that should be near-instant.
 */
const buildTimeout = 300_000;

/**
 * Resolves the bundler's own entry function off a compiler, so the same code drives rspack and
 * webpack. Both hang their module exports on the compiler; whether that object is itself callable
 * differs between them and between versions.
 */
function getBundler(compiler: BundlerCompiler): (options: unknown, callback: (...args: any[]) => void) => void {
  const namespace: any = compiler.rspack ?? compiler.webpack;

  if (!namespace) {
    throw new Error(`${pluginName} could not find the bundler on the compiler. It supports webpack 5 and rspack.`);
  }

  const candidate =
    typeof namespace === 'function' ? namespace : namespace.rspack ?? namespace.webpack ?? namespace.default;

  if (typeof candidate !== 'function') {
    throw new Error(`${pluginName} found the bundler on the compiler but could not call it.`);
  }

  return candidate;
}

/**
 * Picks out the rules that compile scripts, leaving behind the ones for stylesheets and assets.
 *
 * Matching on behavior rather than on loader names: the two bundlers use different loaders for the
 * same job, and a module is free to have replaced either.
 */
function getScriptRules(compiler: BundlerCompiler): Array<unknown> {
  const rules: Array<any> = compiler.options?.module?.rules ?? [];

  const scriptRules = rules.filter((rule) => {
    if (!rule || typeof rule !== 'object' || !(rule.test instanceof RegExp)) {
      return false;
    }

    // This build exists to read the module's schema declarations, so it must not inherit the rule
    // that rewrites them away. That rule is matched by `resource` and so has no `test` to be picked
    // up by, but checking for it directly means a later change to its shape cannot quietly turn
    // extraction into a pass that records nothing.
    if (usesStripLoader(rule)) {
      return false;
    }

    // Probed through a copy: `test` is the live object from the parent's config, and calling
    // `.test()` on a global or sticky regex advances its `lastIndex`, which would leave the real
    // build matching from an offset.
    const probe = new RegExp(rule.test.source, rule.test.flags.replace(/[gy]/g, ''));

    return probe.test('index.tsx') && !probe.test('styles.scss') && !probe.test('image.png');
  });

  if (scriptRules.length === 0) {
    throw new Error(
      `${pluginName} could not find a rule for compiling TypeScript in this module's bundler config, ` +
        `so it cannot build the module to read its config schema.`,
    );
  }

  return scriptRules;
}

/**
 * Copies the parent build's `DefinePlugin`s into the child build.
 *
 * The only plugins that are carried over, and the reason is that they change what the module's own
 * code *means* rather than what is done with it. A default written as
 * `process.env.NODE_ENV === 'production' ? '/api' : '/dev-api'` is a different value depending on
 * whether these run, and the artifact this build produces is what ships: extracting the wrong
 * branch would put a value in the registry that the module itself never declared, with nothing
 * anywhere to say so.
 */
function getDefinePlugins(compiler: BundlerCompiler): Array<unknown> {
  const plugins: Array<any> = compiler.options?.plugins ?? [];

  return plugins.filter((plugin) => plugin?.constructor?.name === 'DefinePlugin');
}

/** Whether a rule runs the loader that rewrites schema declarations away. */
function usesStripLoader(rule: any): boolean {
  const loaders = [rule.loader, ...(Array.isArray(rule.use) ? rule.use : [rule.use])];

  return loaders.some((entry) => {
    const loader = typeof entry === 'string' ? entry : entry?.loader;
    return typeof loader === 'string' && loader.includes('strip-loader');
  });
}

/** Writes the entry that runs `startupApp()` and hands back what it declared. */
function writeEntry(directory: string, options: ChildBuildOptions): string {
  const entryPath = join(directory, 'extract-entry.js');
  const shimPath = require.resolve('./framework-shim');

  const authoredImport = options.authoredValidatorsFile
    ? `import * as authoredValidators from ${JSON.stringify(options.authoredValidatorsFile)};`
    : 'const authoredValidators = undefined;';

  // `startupApp` is optional: a module with no configuration does not have to declare one. It is
  // also allowed to be async, and awaiting it is what makes a schema declared after the first
  // `await` get recorded rather than silently extracting to nothing.
  writeFileSync(
    entryPath,
    `import * as app from ${JSON.stringify(options.srcFile)};
import { getRecordedSchemas, getValidTypes } from ${JSON.stringify(shimPath)};
${authoredImport}

export async function extract() {
  if (typeof app.startupApp === 'function') {
    await app.startupApp();
  }

  return { recorded: getRecordedSchemas(), authoredValidators, validTypes: getValidTypes() };
}
`,
    'utf8',
  );

  return entryPath;
}

export function buildExtractionBundle(
  compiler: BundlerCompiler,
  options: ChildBuildOptions,
): Promise<ChildBuildResult> {
  const bundler = getBundler(compiler);
  const scriptRules = getScriptRules(compiler);
  const outputDirectory = mkdtempSync(join(tmpdir(), 'openmrs-config-schema-'));
  const entryPath = writeEntry(outputDirectory, options);
  const shimPath = require.resolve('./framework-shim');
  const nullLoaderPath = require.resolve('./null-loader');

  const childOptions = {
    name: pluginName,
    context: compiler.options.context ?? options.root,
    mode: 'development',
    target: 'node',
    devtool: false,
    entry: entryPath,
    output: {
      path: outputDirectory,
      filename: 'extract.js',
      library: { type: 'commonjs2' },
      // Async chunks come from `getAsyncLifecycle(() => import(...))`. Loading them with `require`
      // keeps them working from disk without a browser's script loading.
      chunkLoading: 'require',
      chunkFormat: 'commonjs',
    },
    optimization: {
      minimize: false,
      splitChunks: false,
      runtimeChunk: false,
      // Taken from the real build rather than from this one's `mode`, which is only 'development'
      // so that nothing is minified. A schema whose default reads `process.env.NODE_ENV` has to be
      // read the way the build being run would read it.
      nodeEnv: compiler.options.mode ?? 'production',
    },
    resolve: {
      ...(compiler.options.resolve ?? {}),
      alias: {
        ...(compiler.options.resolve?.alias ?? {}),
        // The real framework is browser code and would drag in the styleguide, single-spa and
        // Carbon. The shim answers every name and records the schemas as they are declared.
        '@openmrs/esm-framework/src/internal$': shimPath,
        '@openmrs/esm-framework$': shimPath,
      },
    },
    module: {
      rules: [
        ...scriptRules,
        { test: /\.(css|scss|sass|less)$/, use: [{ loader: nullLoaderPath }], type: 'javascript/auto' },
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif|woff2?|ttf|eot|mp[34]|webm|ogg|wav)$/,
          type: 'asset/resource',
          generator: { emit: false },
        },
      ],
    },
    // Everything else the real build adds is either irrelevant here or actively in the way: Module
    // Federation, the routes copy, type checking, the banner, the analyzer.
    plugins: getDefinePlugins(compiler),
    // Warnings from code we are not building are noise; a genuine failure comes back as an error.
    infrastructureLogging: { level: 'error' },
    stats: 'errors-only',
  };

  return new Promise((resolvePromise, rejectPromise) => {
    let childCompiler: any;
    let settled = false;

    // The directory only becomes the caller's to clean up once this resolves, so every way out of
    // here that isn't success removes it first. Otherwise a module that does not compile leaks one
    // temporary bundle per attempt, and in watch mode that is one per save for as long as it takes
    // to fix.
    const fail = (error: Error) => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timer);
      rmSync(outputDirectory, { recursive: true, force: true });
      rejectPromise(error);
    };

    const succeed = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timer);
      resolvePromise({ bundlePath: resolve(outputDirectory, 'extract.js'), outputDirectory });
    };

    // A compiler that neither calls back nor finishes closing would otherwise leave this promise
    // pending forever, and it is awaited from `beforeCompile`, so the whole build would stall with
    // nothing said. Turning that into an error is the difference between a hang and a report.
    const timer = setTimeout(
      () => fail(new Error(`Building ${options.srcFile} to read its config schema timed out after ${buildTimeout}ms.`)),
      buildTimeout,
    );

    try {
      childCompiler = bundler(childOptions, (error: Error | null, stats: any) => {
        const buildError =
          error ??
          (stats?.hasErrors?.() ? new Error(stats.toString({ all: false, errors: true, colors: false })) : undefined);

        if (!childCompiler?.close) {
          return buildError ? fail(buildError) : succeed();
        }

        childCompiler.close((closeError: Error | null) => {
          if (buildError) {
            fail(buildError);
          } else if (closeError) {
            // Reported rather than discarded: the bundle on disk may be incomplete, and the runner
            // would fail on it with something far less obvious than this.
            fail(closeError);
          } else {
            succeed();
          }
        });
      });
    } catch (error) {
      fail(error as Error);
    }
  });
}
