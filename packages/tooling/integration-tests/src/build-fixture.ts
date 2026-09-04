// Builds the `remote-app` fixture with one of the shared bundler configs, for tests that need to inspect
// what a real OpenMRS app build emits rather than what its config says it will.
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

export const fixtureRoot = resolve(__dirname, '..', '__fixtures__', 'remote-app');
export const fixturePackageName = '@openmrs/esm-fixture-app';
export const entryFilename = 'openmrs-esm-fixture-app.js';

export type FixtureBuild = {
  /** The remote entry the app shell loads, `openmrs-esm-fixture-app.js`. */
  entry: string;
  /** Every emitted JavaScript file, keyed by filename. */
  scripts: Record<string, string>;
  /** Module identifiers from the build's stats, flattened through concatenated modules. */
  moduleIdentifiers: string[];
};

const builds = new Map<string, Promise<FixtureBuild>>();
const tempDirs: string[] = [];

/** Call from `afterAll`. Deletes the output directories the builds in this process wrote. */
export function cleanUpFixtureBuilds() {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  // Module Federation generates its entry module inside the fixture rather than in `output.path`.
  rmSync(join(fixtureRoot, 'node_modules', '.federation'), { recursive: true, force: true });
}

/**
 * Builds the fixture app with one of the shared configs, memoized per bundler and mode.
 */
export function buildFixtureApp(bundler: 'rspack' | 'webpack', mode = 'production'): Promise<FixtureBuild> {
  const key = `${bundler}:${mode}`;
  const cached = builds.get(key);
  if (cached) {
    return cached;
  }

  const build = (async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'openmrs-fixture-build-'));
    tempDirs.push(outDir);

    const originalCwd = process.cwd();
    process.chdir(fixtureRoot);

    try {
      // From source, not `dist`, so this can't pass against a stale build; resolvable only because neither
      // config package declares an `exports` map. Imported here rather than at the top of the file because
      // `@module-federation/enhanced` derives its scratch directory from `process.cwd()` on first import.
      const configModule =
        bundler === 'rspack'
          ? await import('@openmrs/rspack-config/src/index')
          : /* webpack */ await import('@openmrs/webpack-config/src/index');
      const config = configModule.default({}, { mode }) as Record<string, any>;

      config.output.path = outDir;
      // Type checking the fixture is not what these tests are about, and the plugin would report on the
      // repo's own sources from here.
      config.plugins = config.plugins.filter(
        (plugin: { constructor?: { name?: string } }) =>
          plugin?.constructor?.name !== 'TsCheckerRspackPlugin' &&
          plugin?.constructor?.name !== 'ForkTsCheckerWebpackPlugin',
      );

      const { default: bundlerModule } = bundler === 'rspack' ? await import('@rspack/core') : await import('webpack');

      // The two bundlers' call signatures don't unify, hence the cast.
      const compiler = (bundlerModule as (options: unknown) => any)(config);
      const stats = await new Promise<any>((res, rej) => {
        compiler.run((err: unknown, result: any) => {
          if (err) {
            rej(err);
            return;
          }
          if (result?.hasErrors()) {
            rej(new Error(result.toString({ all: false, errors: true })));
            return;
          }
          res(result);
        });
      });
      // Unclosed compilers keep worker threads alive, which surfaces as a vitest hang.
      await new Promise<void>((res) => compiler.close(() => res()));

      // `ids` populates `identifier`; without `nestedModules` scope hoisting hides concatenated modules
      // behind a "… + n modules" entry, which made this blind on the webpack path.
      const { modules = [] } = stats.toJson({ all: false, modules: true, ids: true, nestedModules: true });

      const collectIdentifiers = (list: { identifier?: string; name?: string; modules?: unknown[] }[]): string[] =>
        list.flatMap((module) => [
          module.identifier ?? module.name ?? '',
          ...collectIdentifiers((module.modules ?? []) as typeof list),
        ]);

      const scripts = Object.fromEntries(
        readdirSync(outDir)
          .filter((file) => file.endsWith('.js'))
          .map((file) => [file, readFileSync(join(outDir, file), 'utf8')]),
      );

      return {
        entry: scripts[entryFilename],
        scripts,
        moduleIdentifiers: collectIdentifiers(modules),
      };
    } finally {
      process.chdir(originalCwd);
    }
  })();

  builds.set(key, build);
  return build;
}
