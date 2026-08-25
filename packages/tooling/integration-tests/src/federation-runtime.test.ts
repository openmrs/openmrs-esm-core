// Guards the arrangement that keeps remote entries small: the app shell publishes the Module Federation
// runtime on globals and remote entries read it from there rather than each embedding a copy (~60 kB per
// app on the rspack path). Builds a real remote with each bundler's shared config and inspects it.
import * as errorCodes from '@module-federation/error-codes';
import * as runtimeCore from '@module-federation/runtime-core';
import * as sdk from '@module-federation/sdk';
import { createContext, Script } from 'node:vm';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const fixtureRoot = resolve(__dirname, '..', '__fixtures__', 'remote-app');
const entryFilename = 'openmrs-esm-fixture-app.js';
const fixturePackageName = '@openmrs/esm-fixture-app';

// Mirrors `slugify` in `@openmrs/esm-dynamic-loading`, which is how the app shell finds a container.
const slugify = (name: string) => name.replace(/[\/\-@]/g, '_');

/**
 * A VM context standing in for a page whose app shell has published the runtime, using the same modules
 * the app shell publishes rather than stubs.
 */
function publishedRuntimeContext() {
  const context: Record<string, any> = {
    console,
    // Enough of a DOM for the bundlers' automatic `publicPath` to resolve, which reads `tagName`.
    document: {
      currentScript: { tagName: 'SCRIPT', src: 'http://localhost/openmrs/spa/fixture/entry.js' },
      getElementsByTagName: () => [],
    },
    _FEDERATION_RUNTIME_CORE: runtimeCore,
    _FEDERATION_SDK: sdk,
    _FEDERATION_ERROR_CODES: errorCodes,
    _FEDERATION_RUNTIME_CORE_FROM: { name: '@openmrs/esm-app-shell', version: '2.8.1' },
  };
  context.self = context;
  context.window = context;
  return createContext(context);
}

// The only Module Federation packages a remote may bundle, checked as an allowlist rather than a list of
// forbidden ones so that the runtime returning under a name nobody predicted still fails. These resolve
// the publishing build's federation instance, so remotes keep their own copies (~14 kB). Which of them
// appear depends on hoisting — `runtime` may be reached directly or through `runtime-tools` — so this is
// a subset check, with the positive control below proving the list isn't empty for the wrong reason.
const bundlableModules = [
  '@module-federation/runtime',
  '@module-federation/runtime-tools',
  '@module-federation/webpack-bundler-runtime',
];

// Something the remote is supposed to bundle, so a change to the stats shape or path format can't turn
// the check below into a silent no-op.
const expectedBundledModule = '@module-federation/webpack-bundler-runtime';

type BuildResult = { contents: string; moduleIdentifiers: string[] };

const builds = new Map<string, Promise<BuildResult>>();
const tempDirs: string[] = [];

afterAll(() => {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  // Module Federation generates its entry module inside the fixture rather than in `output.path`.
  rmSync(join(fixtureRoot, 'node_modules', '.federation'), { recursive: true, force: true });
});

/**
 * Builds the fixture app with one of the shared configs and returns the remote entry it emitted, memoized.
 *
 * Both configs read the app's `package.json` from `process.cwd()`, so the build runs from the fixture
 * directory with `output.path` pointed at a temp dir. Module Federation writes its generated entry into
 * the fixture's `node_modules/.federation/`, so parallel runs of this file aren't isolated. `chdir` needs
 * Vitest's `forks` pool, the default here.
 */
function buildRemoteEntry(bundler: 'rspack' | 'webpack'): Promise<BuildResult> {
  const cached = builds.get(bundler);
  if (cached) {
    return cached;
  }

  const build = (async () => {
    const outDir = mkdtempSync(join(tmpdir(), 'openmrs-federation-runtime-'));
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
      const config = configModule.default({}, { mode: 'production' }) as Record<string, any>;

      config.output.path = outDir;
      // Type checking the fixture is not what this test is about, and the plugin would report on the
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

      return {
        contents: readFileSync(join(outDir, entryFilename), 'utf8'),
        moduleIdentifiers: collectIdentifiers(modules),
      };
    } finally {
      process.chdir(originalCwd);
    }
  })();

  builds.set(bundler, build);
  return build;
}

describe.each(['rspack', 'webpack'] as const)('%s remote entries', (bundler) => {
  it('read the Module Federation runtime from the app shell instead of bundling it', async () => {
    const { moduleIdentifiers } = await buildRemoteEntry(bundler);

    // Proves the matching below can see into this build's module list at all.
    expect(moduleIdentifiers.filter((id) => id.includes(`node_modules/${expectedBundledModule}/`))).not.toEqual([]);

    // Every occurrence, not just the first per identifier: a nested copy such as
    // `runtime-tools/node_modules/@module-federation/runtime-core/` would otherwise hide behind its parent.
    const bundledFederationPackages = [
      ...new Set(
        moduleIdentifiers.flatMap((id) =>
          [...id.matchAll(/node_modules\/(@module-federation\/[^/]+)\//g)].map((m) => m[1]),
        ),
      ),
    ].sort();

    expect(bundledFederationPackages.filter((pkg) => !bundlableModules.includes(pkg))).toEqual([]);

    // On the module list, not the entry text: the startup guard names all three globals, so a text match
    // would pass either way.
    const externals = moduleIdentifiers.filter((id) => id.startsWith('external'));
    expect(externals.join('\n')).toContain('_FEDERATION_RUNTIME_CORE');
    expect(externals.join('\n')).toContain('_FEDERATION_SDK');
    expect(externals.join('\n')).toContain('_FEDERATION_ERROR_CODES');
  }, 180_000);

  it('refuses to start, with a diagnosable error, when no app shell published the runtime', async () => {
    const { contents } = await buildRemoteEntry(bundler);

    // A bare global is what an app shell too old to publish the runtime looks like. Executing the entry
    // also proves the guard landed in this chunk, ahead of the code that reads the runtime.
    const context = createContext({ console, self: {} });
    expect(() => new Script(contents).runInContext(context)).toThrow(/does not provide the Module Federation runtime/);
  }, 180_000);

  it('starts and exposes its container when the app shell has published the runtime', async () => {
    const { contents } = await buildRemoteEntry(bundler);
    const context = publishedRuntimeContext();

    // Without this, a guard checking a global nobody publishes — `_FEDERATION_SDKK`, say — would satisfy
    // every other assertion here while making every app in the distribution permanently unstartable.
    expect(() => new Script(contents).runInContext(context)).not.toThrow();

    // The container protocol `esm-dynamic-loading` uses: a `var` named for the slugified package.
    const container = context[slugify(fixturePackageName)];
    expect(container?.init).toBeTypeOf('function');
    expect(container?.get).toBeTypeOf('function');
  }, 180_000);
});

it('prepends the same startup guard from both shared configs', async () => {
  // The guard is duplicated across two independently published packages, so this checks they haven't
  // drifted. Compared as declared rather than as emitted, since the banner is minified after insertion.
  // Sequential because `process.cwd()` is process-wide and the configs `process.exit` without a
  // routes.json.
  const banners: (string | undefined)[] = [];
  for (const bundler of ['rspack', 'webpack'] as const) {
    const originalCwd = process.cwd();
    process.chdir(fixtureRoot);

    try {
      const configModule =
        bundler === 'rspack'
          ? await import('@openmrs/rspack-config/src/index')
          : /* webpack */ await import('@openmrs/webpack-config/src/index');
      const config = configModule.default({}, { mode: 'production' }) as Record<string, any>;
      const plugin = config.plugins.find(
        (candidate: { constructor?: { name?: string } }) => candidate?.constructor?.name === 'BannerPlugin',
      );

      // rspack's builtin-plugin wrapper keeps its options in `_args`; webpack's exposes `options`.
      banners.push((plugin?.options?.banner ?? plugin?._args?.[0]?.banner) as string | undefined);
    } finally {
      process.chdir(originalCwd);
    }
  }

  expect(banners[0]).toBeTypeOf('string');
  expect(banners[0]).toContain('does not provide the Module Federation runtime');
  expect(banners[0]).toBe(banners[1]);
  // A range such as `^2.8.1` would never equal the concrete version the app shell reports, so every app
  // would warn on every page load.
  expect(banners[0]).toMatch(/!=="\d+\.\d+"/);
}, 120_000);
