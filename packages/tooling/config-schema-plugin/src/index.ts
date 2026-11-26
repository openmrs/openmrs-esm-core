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
 * This package's version, part of the cache key. A plugin that cannot read its own manifest still
 * builds, but stops trusting its cache.
 */
function pluginVersion(): string {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return String(require('../package.json').version);
  } catch {
    // Unique per call, so the cache always misses: re-extracting on every build beats shipping an
    // artifact from an older serializer.
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
   * How long to let a module's `startupApp()` run before giving up, in milliseconds. Defaults to
   * 60 seconds. Building the module has its own, longer timeout.
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
 * `startupApp()` and recording the schemas it declares, including its extensions' schemas.
 *
 * The module is executed rather than read statically because real schemas are assembled from
 * imported constants, spreads and sub-schemas.
 *
 * Extraction runs before the main compilation, which resolves the `./config-validators` entry
 * point this plugin generates.
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
   * Rewrites the module's entry point as it is read.
   *
   * Matched by `resource` rather than `test`, so that it touches only the entry point and is not
   * copied into the extraction build by `getScriptRules`, where it would strip the declarations
   * that build records.
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
    // The bundler configs copy a hand-written schema instead of using this plugin. This guards
    // against constructing the plugin directly and extracting over an authored schema.
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

      // Both pipes must be drained, or a module-scope `console.log` can fill the OS buffer and block
      // the child forever. The output is kept to make failures diagnosable.
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
 * The cache key for a module's extracted schema.
 *
 * Hashes file sizes and modification times rather than contents, since this runs on every build.
 * Changes inside the module's `node_modules` are not seen, so a schema built from a library's
 * constants needs the cache cleared.
 */
function hashSources(root: string, moduleName: string, mode: string): string {
  const hash = createHash('sha256');
  const sourceRoot = resolve(root, 'src');

  // The cache outlives `yarn install`, and an artifact from an older serializer looks well-formed.
  hash.update(`plugin:${pluginVersion()}\n`);

  // Schemas declared under any other name are left out, so renaming the package must miss.
  hash.update(`module:${moduleName}\n`);

  // Defaults may read `process.env.NODE_ENV`, so without this a `yarn start` followed by a
  // `yarn build` would ship the development value.
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
        // Removed since it was listed, e.g. an editor's temp file, so it cannot affect the schema.
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
 * Reads a cached entry, treating anything malformed as a miss. The plugin version in the key
 * catches shape changes between releases; this catches them in a working tree, where the version
 * does not move.
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
 * Writes the artifact to disk as well as into the build output, because `openmrs develop` reads it
 * from each module's directory and a dev server keeps its output in memory.
 *
 * A module with nothing to declare gets an empty file, so a schema that was removed stops being
 * served.
 */
function writeArtifactFile(artifactPath: string, artifact: ConfigSchemaArtifact): void {
  try {
    mkdirSync(dirname(artifactPath), { recursive: true });
    writeFileSync(artifactPath, JSON.stringify(artifact), 'utf8');
  } catch {
    // As with the cache: useful when it works, never a reason to fail a build.
  }
}
