// Builds the `remote-app` fixture with one of the shared bundler configs, for tests that need to inspect
// what a real OpenMRS app build emits rather than what its config says it will.
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

export const fixtureRoot = resolve(__dirname, '..', '__fixtures__', 'remote-app');
export const fixturePackageName = '@openmrs/esm-fixture-app';
export const entryFilename = 'openmrs-esm-fixture-app.js';

/** Resolves any fixture app under `__fixtures__`, for tests that need one other than `remote-app`. */
export function fixtureRootOf(fixture: string) {
  return resolve(__dirname, '..', '__fixtures__', fixture);
}

export type FixtureBuild = {
  /** The remote entry the app shell loads, `openmrs-esm-fixture-app.js`. */
  entry: string;
  /** Every emitted JavaScript file, keyed by filename. */
  scripts: Record<string, string>;
  /** Every emitted stylesheet, keyed by filename. Empty in development, where `style-loader` inlines. */
  stylesheets: Record<string, string>;
  /** Graph of every module in the build. Keys are module names. Values are modules that depend on that module. */
  moduleGraph: Record<string, string[]>;
};

const builds = new Map<string, Promise<FixtureBuild>>();
const tempDirs: string[] = [];
const builtRoots = new Set<string>();

/** Call from `afterAll`. Deletes the output directories the builds in this process wrote. */
export function cleanUpFixtureBuilds() {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  // Module Federation generates its entry module inside the fixture rather than in `output.path`.
  for (const root of builtRoots) {
    rmSync(join(root, 'node_modules', '.federation'), { recursive: true, force: true });
  }
}

/**
 * Builds the fixture app with one of the shared configs, memoized per bundler and mode.
 */
export function buildFixtureApp(
  bundler: 'rspack' | 'webpack',
  mode = 'production',
  fixture = 'remote-app',
): Promise<FixtureBuild> {
  const key = `${bundler}:${mode}:${fixture}`;
  const cached = builds.get(key);
  if (cached) {
    return cached;
  }

  const build = (async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'openmrs-fixture-build-'));
    tempDirs.push(outDir);

    const root = fixtureRootOf(fixture);
    builtRoots.add(root);

    const originalCwd = process.cwd();
    process.chdir(root);

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
      const { modules = [] } = stats.toJson({
        all: false,
        modules: true,
        ids: true,
        nestedModules: true,
        reasons: true,
      });

      type StatsModule = {
        identifier?: string;
        name?: string;
        modules?: unknown[];
        reasons?: Array<{ moduleIdentifier?: string; module?: string }>;
      };

      const collectModules = (list: StatsModule[]): Array<[string, string[]]> =>
        list.flatMap((module) => [
          [
            module.identifier ?? module.name ?? '',
            (module.reasons ?? []).map((reason) => reason.moduleIdentifier ?? reason.module ?? '').filter(Boolean),
          ] as [string, string[]],
          ...collectModules((module.modules ?? []) as StatsModule[]),
        ]);

      const emitted = (extension: string) =>
        Object.fromEntries(
          readdirSync(outDir)
            .filter((file) => file.endsWith(extension))
            .map((file) => [file, readFileSync(join(outDir, file), 'utf8')]),
        );
      const scripts = emitted('.js');

      // Read from the fixture's own manifest, since the shared configs name the remote entry after it.
      const { browser } = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
      const entry = scripts[basename(browser)];

      // Checked rather than handed on as `undefined`: `new Script(undefined)` compiles the source text
      // `"undefined"` and runs without complaint, so a change to the emitted filename would leave the
      // tests that execute the entry passing while executing nothing.
      if (!entry) {
        throw new Error(
          `The ${bundler} build emitted no ${basename(browser)}. Emitted: ${Object.keys(scripts).join(', ')}`,
        );
      }

      return {
        entry,
        scripts,
        stylesheets: emitted('.css'),
        moduleGraph: Object.fromEntries(collectModules(modules)),
      };
    } finally {
      process.chdir(originalCwd);
    }
  })();

  builds.set(key, build);
  return build;
}
