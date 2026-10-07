import { fork } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { buildExtractionBundle, type BundlerCompiler } from './child-build';
import { writeValidatorsModule } from './generate-validators';
import { getConfigSchemaPaths } from './paths';
import { clearStripPlan, setStripPlan } from './strip-loader';
import type { RunnerResponse } from './runner';
import type { ConfigSchemaArtifact, SerializeResult, TransposedValidator } from './types';

export { getConfigSchemaPaths, type ConfigSchemaPaths } from './paths';
export { serializeArtifact } from './serialize';
export * from './types';

const pluginName = 'OpenmrsConfigSchemaPlugin';

/** The artifact's name in the module's output, alongside `routes.json`. */
export const configSchemaFileName = 'config-schema.json';

/**
 * This package's version, which is part of what a cached artifact is keyed on.
 *
 * Read lazily and tolerantly: a plugin that cannot find its own manifest should still build, it
 * should just stop trusting its cache.
 */
function pluginVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return String(require('../package.json').version);
  } catch {
    // Deliberately different on every call, which makes the cache key miss every time: a module
    // that pays for a fresh extraction on each build is a far better outcome than one quietly
    // shipping an artifact some older version of this serializer produced. The cost, if this is
    // ever reached, is that the cache stops working entirely and silently.
    return `unknown-${Date.now()}`;
  }
}

export interface ConfigSchemaPluginOptions {
  /** The module's package name, which is the module the schema applies to. */
  moduleName: string;
  /** The module's package root. */
  root: string;
  /** The module's entry point, as computed from `package.json`. */
  srcFile: string;
  /**
   * How long to let a module's `startupApp()` run before giving up. Defaults to 60 seconds.
   *
   * Bounds running the module, not building it. Building has its own, far longer bound, since one
   * is a compilation and the other should return immediately.
   */
  timeout?: number;
}

interface CacheEntry {
  key: string;
  artifact: ConfigSchemaArtifact;
  transposedValidators: Array<TransposedValidator>;
  warnings: Array<string>;
}

/**
 * Emits a module's `config-schema.json` next to its `routes.json`, by running the module's
 * `startupApp()` and recording the schemas it declares.
 *
 * Executing the module rather than reading its source is deliberate: a real schema is assembled
 * from imported constants, spreads and composed sub-schemas, none of which survive being read
 * statically. Running `startupApp()` rather than a conventionally named file is likewise
 * deliberate: it captures what the module actually declares, including schemas for its
 * extensions, without requiring it to keep them anywhere in particular.
 *
 * Runs before the main compilation rather than alongside it, because the `./config-validators`
 * entry point it generates has to exist by the time the main compilation resolves it.
 */
export class ConfigSchemaPlugin {
  constructor(private readonly options: ConfigSchemaPluginOptions) {}

  apply(compiler: BundlerCompiler & Record<string, any>) {
    const paths = getConfigSchemaPaths(this.options.root);
    const cacheDirectory = join(this.options.root, 'node_modules', '.cache', 'openmrs');
    const cachePath = join(cacheDirectory, 'config-schema.cache.json');
    const artifactPath = join(cacheDirectory, configSchemaFileName);

    let result: CacheEntry | undefined;
    let failure: Error | undefined;

    this.addStripLoader(compiler);

    compiler.hooks.beforeCompile.tapPromise(pluginName, async () => {
      result = undefined;
      failure = undefined;
      clearStripPlan(this.options.srcFile);

      try {
        result = await this.extract(compiler, paths, cachePath);

        writeArtifactFile(artifactPath, result.artifact);

        // Only now is it known what the registry will carry, and so which of the module's own
        // declarations have become redundant.
        setStripPlan(this.options.srcFile, {
          moduleName: this.options.moduleName,
          hasModuleSchema: Boolean(result.artifact.configurationSchema),
          extensionNames: Object.keys(result.artifact.extensionConfigurationSchemas ?? {}),
        });

        writeValidatorsModule({
          outputPath: paths.generatedValidators,
          authoredValidatorsFile: paths.authoredValidators,
          transposed: result.transposedValidators,
        });
      } catch (error) {
        failure = error instanceof Error ? error : new Error(String(error));

        // The expose has to resolve even when extraction failed, or the build's own error is
        // buried under a module-not-found for a file this plugin was supposed to write.
        writeValidatorsModule({
          outputPath: paths.generatedValidators,
          authoredValidatorsFile: paths.authoredValidators,
          transposed: [],
        });
      }
    });

    compiler.hooks.thisCompilation.tap(pluginName, (compilation: any) => {
      const { Compilation, sources } = (compiler.rspack ?? compiler.webpack) as any;

      compilation.hooks.processAssets.tap(
        { name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        () => {
          if (failure) {
            compilation.errors.push(
              new Error(
                `${pluginName} could not read the configuration schema for ${this.options.moduleName}:\n\n${failure.message}`,
              ),
            );
            return;
          }

          if (!result) {
            return;
          }

          for (const warning of result.warnings) {
            compilation.warnings.push(new Error(`${this.options.moduleName}: ${warning}`));
          }

          const { configurationSchema, extensionConfigurationSchemas } = result.artifact;

          // A module with no configuration is ordinary; it simply has no artifact to ship.
          if (!configurationSchema && !extensionConfigurationSchemas) {
            return;
          }

          compilation.emitAsset(configSchemaFileName, new sources.RawSource(JSON.stringify(result.artifact)));
        },
      );
    });
  }

  /**
   * Arranges for the module's entry point to be rewritten as it is read.
   *
   * Matched by `resource` rather than by a `test` pattern, which is load-bearing in two ways: the
   * rewrite only ever applies to the one file that declares the schemas, and the rule is invisible
   * to `getScriptRules` in `child-build.ts`, which selects the parent's script rules by their
   * `test` and would otherwise copy this one into the extraction build. That build has to read the
   * module's declarations in order to record them, so rewriting them away first would leave it
   * recording nothing at all.
   */
  private addStripLoader(compiler: BundlerCompiler & Record<string, any>) {
    const module = (compiler.options.module ??= {});
    const rules = (module.rules ??= []);

    rules.push({
      resource: this.options.srcFile,
      // Runs before the module is compiled, so it sees the source as written.
      enforce: 'pre',
      use: [{ loader: require.resolve('./strip-loader') }],
    });
  }

  private async extract(
    compiler: BundlerCompiler & Record<string, any>,
    paths: ReturnType<typeof getConfigSchemaPaths>,
    cachePath: string,
  ): Promise<CacheEntry> {
    // A hand-written schema is the schema. Copying it is the bundler config's job, which is why
    // both bundler configs build a `CopyPlugin` instead of this plugin when they see one, so this
    // is unreachable through them; it is here so that constructing the plugin directly cannot
    // extract a schema over the top of an authored one.
    if (paths.handWrittenSchema) {
      return { key: 'hand-written', artifact: {}, transposedValidators: [], warnings: [] };
    }

    const key = hashSources(this.options.root, this.options.moduleName, compiler.options.mode ?? 'production');
    const cached = readCache(cachePath);

    if (cached && cached.key === key) {
      return cached;
    }

    const build = await buildExtractionBundle(compiler, {
      root: this.options.root,
      srcFile: this.options.srcFile,
      authoredValidatorsFile: paths.authoredValidators,
    });

    let serialized: SerializeResult;

    try {
      serialized = await this.run(build.bundlePath);
    } finally {
      // A watch build extracts again on every save, and each bundle is an unminified copy of the
      // whole module. Removed only once the runner has let go of it.
      rmSync(build.outputDirectory, { recursive: true, force: true });
    }

    if (serialized.errors.length > 0) {
      throw new Error(serialized.errors.join('\n\n'));
    }

    const entry: CacheEntry = {
      key,
      artifact: serialized.artifact,
      transposedValidators: serialized.transposedValidators,
      warnings: serialized.warnings,
    };

    writeCache(cachePath, entry);

    return entry;
  }

  private run(bundlePath: string): Promise<SerializeResult> {
    const runnerPath = require.resolve('./runner');
    const timeout = this.options.timeout ?? 60_000;

    return new Promise((resolvePromise, rejectPromise) => {
      const child = fork(runnerPath, { stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
      let output = '';
      let settled = false;

      const settle = (settleWith: () => void) => {
        if (settled) {
          return;
        }

        settled = true;
        clearTimeout(timer);
        child.kill();
        settleWith();
      };

      const timer = setTimeout(() => {
        settle(() =>
          rejectPromise(
            new Error(
              `Running ${this.options.moduleName}'s startupApp() timed out after ${timeout}ms. ` +
                `Module-scope code that waits on the network or the DOM will do this.` +
                (output ? `\n\n${output}` : ''),
            ),
          ),
        );
      }, timeout);

      // Both pipes have to be read. An undrained pipe fills its OS buffer and the child then blocks
      // forever on its next write, which a module-scope `console.log` anywhere in its import graph
      // is enough to cause. Keeping the output also makes a failure diagnosable.
      const collect = (chunk: unknown) => {
        output += String(chunk);
      };

      child.stdout?.on('data', collect);
      child.stderr?.on('data', collect);

      child.on('message', (response: RunnerResponse) => {
        if (response.ok) {
          settle(() => resolvePromise(response.result));
        } else {
          settle(() => rejectPromise(new Error(response.error)));
        }
      });

      child.on('error', (error) => settle(() => rejectPromise(error)));

      child.on('exit', (code) => {
        settle(() =>
          rejectPromise(
            new Error(
              `Running ${this.options.moduleName}'s startupApp() exited with code ${code} before reporting a schema.` +
                (output ? `\n\n${output}` : ''),
            ),
          ),
        );
      });

      child.send({ bundlePath, moduleName: this.options.moduleName });
    });
  }
}

/**
 * Identifies the module's sources and the tooling that reads them, so that an unchanged module is
 * not rebuilt to learn the same schema, and a changed *serializer* is not ignored.
 *
 * Size and modification time rather than contents: this runs on every build of every module, and
 * reading every file to hash it would cost more than it saves. Changes inside the module's
 * `node_modules` are still not seen, so a schema built out of a library's constants needs the
 * cache cleared.
 */
function hashSources(root: string, moduleName: string, mode: string): string {
  const hash = createHash('sha256');
  const sourceRoot = resolve(root, 'src');

  // The cache outlives `yarn install`, so without this a module whose sources have not changed
  // keeps serving an artifact produced by an older serializer, which is the one failure this design
  // has no way to notice, since the artifact looks perfectly well-formed.
  hash.update(`plugin:${pluginVersion()}\n`);

  // Not derived from `src`, and load-bearing: a schema declared for a name other than this one is
  // left out of the artifact. Renaming the package would otherwise keep serving the old one.
  hash.update(`module:${moduleName}\n`);

  // The extraction build reads `process.env.NODE_ENV` the way the real build does, so a default
  // written in terms of it extracts differently per mode. One cache file serves both, so without
  // this a `yarn start` followed by a `yarn build` ships the development value.
  hash.update(`mode:${mode}\n`);

  const walk = (directory: string) => {
    let entries: Array<string>;

    try {
      entries = readdirSync(directory).sort();
    } catch {
      return;
    }

    for (const entry of entries) {
      const path = join(directory, entry);
      let stats: ReturnType<typeof statSync>;

      try {
        stats = statSync(path);
      } catch {
        // Listed a moment ago and gone now: an editor saving through a temp file, or a branch
        // switch. It cannot be part of the schema, and failing the build over it would be absurd.
        continue;
      }

      if (stats.isDirectory()) {
        walk(path);
      } else {
        hash.update(`${path}:${stats.size}:${stats.mtimeMs}\n`);
      }
    }
  };

  walk(sourceRoot);

  return hash.digest('hex');
}

/**
 * Reads a cached artifact, ignoring anything that is not one.
 *
 * The shape is checked rather than assumed: the cache outlives the plugin that wrote it, so an
 * entry written by a version whose `CacheEntry` had different fields is an ordinary thing to find,
 * and it has to read as a miss rather than as a half-populated result that fails much later. The
 * plugin version in the cache key catches this between releases; this catches it in a working tree,
 * where the shape can change without the version moving.
 */
function readCache(cachePath: string): CacheEntry | undefined {
  let parsed: unknown;

  try {
    parsed = JSON.parse(readFileSync(cachePath, 'utf8'));
  } catch {
    return undefined;
  }

  const entry = parsed as Partial<CacheEntry>;

  const looksRight =
    Boolean(entry) &&
    typeof entry === 'object' &&
    typeof entry.key === 'string' &&
    Boolean(entry.artifact) &&
    Array.isArray(entry.transposedValidators) &&
    Array.isArray(entry.warnings);

  return looksRight ? (entry as CacheEntry) : undefined;
}

function writeCache(cachePath: string, entry: CacheEntry): void {
  try {
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, JSON.stringify(entry), 'utf8');
  } catch {
    // A cache that cannot be written is not worth failing a build over.
  }
}

/**
 * Writes the artifact somewhere on disk as well as into the build output.
 *
 * `openmrs develop` assembles its registry by reading each module's source directory, and never
 * sees the build output at all: a dev server generally serves its assets from memory. Without a
 * copy on disk, no module would have a static schema in development, and the path this all runs on
 * would only ever be exercised in a built distribution.
 *
 * A module with nothing to declare gets an empty file rather than none, so that a schema which used
 * to exist and no longer does stops being served.
 */
function writeArtifactFile(artifactPath: string, artifact: ConfigSchemaArtifact): void {
  try {
    mkdirSync(dirname(artifactPath), { recursive: true });
    writeFileSync(artifactPath, JSON.stringify(artifact), 'utf8');
  } catch {
    // As with the cache: useful when it works, never a reason to fail a build.
  }
}
