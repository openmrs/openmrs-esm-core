// Both type checker plugins watch every directory the tsconfig includes with their own copy of Chokidar 4,
// which opens a handle per file. For an app whose tsconfig has no `include` that is the whole app directory,
// and unless the shared configs keep those watchers out of `node_modules`, the dev server of such an app dies
// with EMFILE on macOS. These start a watching build of the `no-include-app` fixture with each config and ask
// the plugin's watchers what they ended up watching.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, sep } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fixtureRootOf } from './build-fixture';

type Bundler = 'rspack' | 'webpack';
type ChokidarWatcher = {
  getWatched: () => Record<string, Array<string>>;
  on: (event: 'ready', listener: () => void) => unknown;
};

const root = fixtureRootOf('no-include-app');
const installedPackage = join(root, 'node_modules', 'installed-package');
// Somewhere other than the `dist` the fixture's `package.json` names, set through `additionalConfig`.
const outputDir = join(root, 'custom-output');
const tempDirs: string[] = [];
const requireFromHere = createRequire(__filename);
let originalCwd: string;

// The whole file runs from inside the fixture: the configs resolve the app from `process.cwd()`, and a
// watching compiler keeps using it after `compiler.watch` returns.
beforeAll(() => {
  originalCwd = process.cwd();
  process.chdir(root);
  // Something for the watchers to find, should they look.
  mkdirSync(installedPackage, { recursive: true });
  writeFileSync(join(installedPackage, 'index.js'), 'module.exports = {};\n');
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'emitted.js'), '');
});

afterAll(() => {
  process.chdir(originalCwd);
  for (const dir of [...tempDirs, installedPackage, outputDir]) {
    rmSync(dir, { recursive: true, force: true });
  }
  // Module Federation generates its entry module inside the fixture rather than in `output.path`.
  rmSync(join(root, 'node_modules', '.federation'), { recursive: true, force: true });
});

/** Records every watcher the type checker plugin starts on its own copy of Chokidar. */
function recordWatchers(bundler: Bundler) {
  const pluginDir = dirname(
    requireFromHere.resolve(bundler === 'rspack' ? 'ts-checker-rspack-plugin' : 'fork-ts-checker-webpack-plugin', {
      paths: [dirname(requireFromHere.resolve(`@openmrs/${bundler}-config/package.json`))],
    }),
  );
  const chokidarModule = requireFromHere(requireFromHere.resolve('chokidar', { paths: [pluginDir] }));
  const chokidar = chokidarModule.__esModule ? chokidarModule.default : chokidarModule;
  const watch = chokidar.watch;
  const watchers: Array<{ watcher: ChokidarWatcher; ready: Promise<void> }> = [];

  chokidar.watch = (...args: Array<unknown>) => {
    const watcher: ChokidarWatcher = watch(...args);
    watchers.push({ watcher, ready: new Promise<void>((res) => watcher.on('ready', res)) });
    return watcher;
  };

  return {
    watchers,
    restore: () => {
      chokidar.watch = watch;
    },
  };
}

async function createCompiler(bundler: Bundler, { customOutputDir }: { customOutputDir?: string } = {}) {
  // From source, not `dist`, so this can't pass against a stale build.
  const configModule =
    bundler === 'rspack'
      ? await import('@openmrs/rspack-config/src/index')
      : await import('@openmrs/webpack-config/src/index');
  if (customOutputDir) {
    configModule.additionalConfig.output = { path: customOutputDir };
  }
  const config = configModule.default({}, { mode: 'development' }) as Record<string, any>;
  delete configModule.additionalConfig.output;

  if (!customOutputDir) {
    // Out of the fixture, so that the build leaves nothing behind there.
    const outDir = mkdtempSync(join(tmpdir(), 'openmrs-type-checker-watchers-'));
    tempDirs.push(outDir);
    config.output.path = outDir;
  }

  const { default: bundlerModule } = bundler === 'rspack' ? await import('@rspack/core') : await import('webpack');
  // The two bundlers' call signatures don't unify, hence the cast.
  return (bundlerModule as unknown as (options: unknown) => any)(config);
}

/** Every file and directory the type checker's watchers hold once a watching build has settled. */
async function pathsWatchedByTypeChecker(bundler: Bundler, options?: { customOutputDir?: string }) {
  const compiler = await createCompiler(bundler, options);
  // After the config is loaded, since `@openmrs/webpack-config` wraps Chokidar's `watch` itself on import.
  const { watchers, restore } = recordWatchers(bundler);
  let watching: { close: (callback: () => void) => void } | undefined;

  try {
    await new Promise<void>((res, rej) => {
      watching = compiler.watch(compiler.options.watchOptions, (err: unknown) => (err ? rej(err) : res()));
    });
    // The plugin starts its watchers when the compiler goes back to watching after the first build.
    await expect.poll(() => watchers.length, { timeout: 30_000 }).toBeGreaterThan(0);
    await Promise.all(watchers.map(({ ready }) => ready));

    return watchers.flatMap(({ watcher }) =>
      Object.entries(watcher.getWatched()).flatMap(([directory, entries]) => [
        directory,
        ...entries.map((entry) => join(directory, entry)),
      ]),
    );
  } finally {
    restore();
    await new Promise<void>((res) => (watching ? watching.close(() => res()) : res()));
    await new Promise<void>((res) => compiler.close(() => res()));
  }
}

describe('the type checker of a watching build, for a tsconfig with no `include`', () => {
  it.each<Bundler>(['rspack', 'webpack'])(
    'watches the app but not its `node_modules`, with %s',
    async (bundler) => {
      const watched = await pathsWatchedByTypeChecker(bundler);

      // Without this, an empty list would also be what a checker that watched nothing looks like.
      expect(watched).toContain(join(root, 'src', 'index.ts'));
      expect(watched.filter((path) => path.split(sep).includes('node_modules'))).toEqual([]);
    },
    60_000,
  );

  // The webpack dev server writes its output to disk, and the checker takes a file emitted into a directory
  // it watches for a new source file, which starts another build.
  it('stays out of the output directory with webpack, wherever the app puts it', async () => {
    const watched = await pathsWatchedByTypeChecker('webpack', { customOutputDir: outputDir });

    expect(watched).toContain(join(root, 'src', 'index.ts'));
    expect(watched.filter((path) => path === outputDir || path.startsWith(outputDir + sep))).toEqual([]);
  }, 60_000);
});
