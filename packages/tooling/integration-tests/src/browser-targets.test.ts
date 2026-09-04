// Guards that the shared configs compile for the browsers O3 supports rather than letting swc fall back
// to its ES5 default, which shipped transform helpers and down-levelled syntax to every browser in the
// support policy. Checks both the targets the configs hand swc and the code a real build emits, since
// the first can be right while the second is not.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import browserslist from 'browserslist';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { buildFixtureApp, cleanUpFixtureBuilds, fixtureRoot } from './build-fixture';

const bundlers = ['rspack', 'webpack'] as const;

// The policy's queries, as the configs are expected to pass them along.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const openmrsQueries: string[] = require('browserslist-config-openmrs');

// The same policy as concrete browser versions, reached through browserslist's own `extends` handling —
// the way an OpenMRS module declares it, and a route the configs deliberately don't use. Checks that
// need to ask what a browser actually supports go through this.
const openmrsTargets = browserslist(['extends browserslist-config-openmrs'], { path: fixtureRoot });

// Named exactly as swc emits them. Each is the helper for one of the constructs the fixture uses, so if a
// build stops declaring a target these reappear alongside the syntax checks below failing.
const es5Helpers = [
  '_async_to_generator',
  '_class_call_check',
  '_class_private_field_get',
  '_create_class',
  '_ts_generator',
];

const tempDirs: string[] = [];

afterAll(() => {
  cleanUpFixtureBuilds();
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  rmSync(join(__dirname, '..', 'node_modules', '.scratch-apps'), { recursive: true, force: true });
});

/** The `swc-loader` / `builtin:swc-loader` options a config puts on its JS/TS rule. */
function scriptLoaderOptions(config: Record<string, any>) {
  const rule = config.module.rules.find((candidate: { test?: RegExp }) => candidate.test?.test?.('example.tsx'));
  // rspack sets `loader`/`options` on the rule; webpack nests them under `use`.
  return rule.options ?? rule.use?.options;
}

/**
 * Loads a shared config as an app in `root` would get it.
 *
 * Sequential use only: both configs read the app's `package.json` from `process.cwd()`, and they
 * `process.exit` when it has no `routes.json` alongside it.
 */
async function loadConfigFrom(bundler: (typeof bundlers)[number], root: string) {
  const originalCwd = process.cwd();
  process.chdir(root);

  try {
    const configModule =
      bundler === 'rspack'
        ? await import('@openmrs/rspack-config/src/index')
        : /* webpack */ await import('@openmrs/webpack-config/src/index');
    return configModule.default({}, { mode: 'production' }) as Record<string, any>;
  } finally {
    process.chdir(originalCwd);
  }
}

/**
 * A throwaway app directory, complete enough that the shared configs will load for it.
 *
 * Placed inside this package's `node_modules` rather than the system temp directory so that node
 * resolution from it reaches the repo's packages — an `extends` query names a config that has to be
 * resolvable from the module being built — and so that a crashed run leaves nothing git tracks.
 */
function scratchApp(packageJson: Record<string, unknown>) {
  const scratchBase = join(__dirname, '..', 'node_modules', '.scratch-apps');
  mkdirSync(scratchBase, { recursive: true });
  const root = mkdtempSync(join(scratchBase, 'app-'));
  tempDirs.push(root);
  mkdirSync(join(root, 'src'));
  writeFileSync(join(root, 'src', 'routes.json'), '{}');
  writeFileSync(join(root, 'src', 'index.ts'), 'export function startupApp() {}');
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({
      name: '@openmrs/esm-scratch-app',
      version: '1.0.0',
      browser: 'dist/openmrs-esm-scratch-app.js',
      main: 'src/index.ts',
      types: 'src/index.ts',
      peerDependencies: {},
      ...packageJson,
    }),
  );
  return root;
}

/**
 * A scratch module that reaches the policy through `extends <name>`, alongside a shared config package
 * of that name exporting `moduleExports`.
 *
 * Written into the scratch module's own `node_modules` so the `extends` query resolves from the module
 * being built, which is where browserslist looks.
 */
function scratchAppExtending(name: string, moduleExports: string) {
  const root = scratchApp({ browserslist: [`extends ${name}`] });
  const configDir = join(root, 'node_modules', name);
  mkdirSync(configDir, { recursive: true });
  writeFileSync(join(configDir, 'package.json'), JSON.stringify({ name, version: '1.0.0', main: 'index.js' }));
  writeFileSync(join(configDir, 'index.js'), moduleExports);
  return root;
}

describe.each(bundlers)('the %s config', (bundler) => {
  it('compiles for the browsers RFC 0003 supports', async () => {
    const options = scriptLoaderOptions(await loadConfigFrom(bundler, fixtureRoot));

    expect(options.env.targets).toEqual(openmrsQueries);

    // Whatever representation, it has to still mean the browsers RFC 0003 names.
    expect(browserslist(options.env.targets, { path: fixtureRoot })).toEqual(openmrsTargets);

    // swc rejects the two together, so a `jsc.target` creeping in would break every build outright.
    expect(options.jsc?.target).toBeUndefined();
  });

  it('lets an app override the targets through its own browserslist config', async () => {
    const root = scratchApp({ browserslist: ['chrome 91'] });
    const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));

    expect(options.env.targets).toEqual(['chrome 91']);
  });

  it("expands an app's `extends` query, which swc itself cannot follow", async () => {
    // How every OpenMRS module in practice names the policy.
    const root = scratchApp({ browserslist: ['extends browserslist-config-openmrs'] });
    const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));

    expect(options.env.targets).toEqual(openmrsQueries);
    expect(options.env.targets.some((query: string) => query.startsWith('extends '))).toBe(false);
  });

  // A shared config is not simply an array of queries, and getting any of this wrong reads as the
  // module's policy being silently swapped for the OpenMRS default. Each case is pinned against what
  // browserslist itself resolves, which is also what would fail if the loader borrowed from its internal
  // `node` entry point ever moved.
  describe('a shared browserslist config', () => {
    // Sections keyed by environment, which is the shape Greptile flagged: read as a flat array this
    // throws, and the catch below would report the module's policy as unloadable and quietly build for
    // OpenMRS's instead.
    const envConfig =
      "module.exports = { production: ['chrome 120'], development: ['chrome 90'], defaults: ['chrome 100'] };";

    it.each([
      ['production', ['chrome 120']],
      ['development', ['chrome 90']],
      // No section of this name, so browserslist falls to `defaults`.
      ['staging', ['chrome 100']],
    ])('is read as the %s section when it exports an object of envs', async (env, expected) => {
      const root = scratchAppExtending('browserslist-config-envs', envConfig);
      const previous = process.env.BROWSERSLIST_ENV;
      // Set explicitly rather than left to `NODE_ENV`, which vitest pins to `test`.
      process.env.BROWSERSLIST_ENV = env;
      browserslist.clearCaches();

      try {
        const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));

        expect(options.env.targets).toEqual(expected);
        // The same section browserslist itself would have picked.
        expect(browserslist(options.env.targets)).toEqual(
          browserslist(['extends browserslist-config-envs'], { path: root }),
        );
      } finally {
        process.env.BROWSERSLIST_ENV = previous;
        browserslist.clearCaches();
      }
    });

    it('is unwrapped when it is a transpiled ES module', async () => {
      const root = scratchAppExtending(
        'browserslist-config-esm',
        "exports.__esModule = true;\nexports.default = ['chrome 118'];",
      );
      const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));

      expect(options.env.targets).toEqual(['chrome 118']);
    });

    it('is refused, not loaded, when its name lacks the browserslist-config- prefix', async () => {
      const root = scratchAppExtending('sneaky-config', "module.exports = ['chrome 100'];");
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      try {
        // browserslist declines to `require` a package not named as a browserslist config, and so must
        // this: an `extends` query otherwise executes whatever package it names.
        const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));
        expect(options.env.targets).toEqual(openmrsQueries);
        expect(options.env.targets).not.toContain('chrome 100');
      } finally {
        warn.mockRestore();
      }
    });

    it('resolves a config that extends another config', async () => {
      const root = scratchAppExtending(
        'browserslist-config-outer',
        "module.exports = ['extends browserslist-config-inner'];",
      );
      const inner = join(root, 'node_modules', 'browserslist-config-inner');
      mkdirSync(inner, { recursive: true });
      writeFileSync(
        join(inner, 'package.json'),
        JSON.stringify({ name: 'browserslist-config-inner', version: '1.0.0', main: 'index.js' }),
      );
      writeFileSync(join(inner, 'index.js'), "module.exports = ['chrome 117'];");

      const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));
      expect(options.env.targets).toEqual(['chrome 117']);
    });
  });

  it('warns and keeps building when an app names a browserslist config that will not load', async () => {
    const root = scratchApp({ browserslist: ['extends browserslist-config-nonexistent'] });
    const warnings: string[] = [];
    const warn = vi.spyOn(console, 'warn').mockImplementation((message) => void warnings.push(String(message)));

    try {
      // Loading the config at all is the assertion.
      const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));
      expect(options.env.targets).toEqual(openmrsQueries);
    } finally {
      warn.mockRestore();
    }

    expect(warnings.join('\n')).toContain('browserslist-config-nonexistent');
  });

  it('falls back to the OpenMRS policy for an app that declares no browsers', async () => {
    const root = scratchApp({});
    const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));

    expect(options.env.targets).toEqual(openmrsQueries);
    // Not browserslist's own `defaults`, which reaches years further back than O3 supports.
    expect(browserslist(options.env.targets)).not.toEqual(browserslist(['defaults']));
  });

  it('emits the modern syntax it was given rather than ES5', async () => {
    const { scripts } = await buildFixtureApp(bundler);

    // The exposed module gets its own chunk, under a name that depends on chunk ids, so it's found by the
    // export it carries. Asserting there is exactly one keeps this from silently checking nothing.
    const carriers = Object.entries(scripts).filter(([, contents]) => contents.includes('startupApp'));
    expect(carriers).toHaveLength(1);

    const [, exposedChunk] = carriers[0];

    // The fixture's private field, `async` function and optional chaining, all of which swc rewrites for
    // an ES5 target. Minifiers rename a private field but cannot remove the `#`.
    expect(exposedChunk).toMatch(/#[A-Za-z_$]/);
    expect(exposedChunk).toMatch(/\basync\b/);
    expect(exposedChunk).toMatch(/\?\./);

    for (const helper of es5Helpers) {
      expect(exposedChunk).not.toContain(helper);
    }
  }, 180_000);
});

describe('the bundler runtime target', () => {
  // `output.environment` is what decides the syntax of the runtime and chunk-loading glue the bundler
  // writes itself, which swc never sees. Both configs derive it from the module's browserslist, and the
  // two bundlers resolve those queries with different browser data — webpack with this repo's, rspack
  // with the older set its Rust port bundles — so these checks are what hold the two together.
  async function environmentFor(bundler: (typeof bundlers)[number], target: unknown) {
    const { default: bundlerModule } = bundler === 'rspack' ? await import('@rspack/core') : await import('webpack');
    const compiler = (bundlerModule as (options: unknown) => any)({ context: fixtureRoot, target });
    const { environment } = compiler.options.output;
    await new Promise<void>((res) => compiler.close(() => res()));
    return Object.fromEntries(
      Object.entries(environment as Record<string, boolean>).filter(([key]) => key !== 'nodePrefixForCoreModules'),
    );
  }

  it('is derived from the policy rather than pinned to an ES level', async () => {
    const { target } = await loadConfigFrom('rspack', fixtureRoot);

    // Inlined, not a bare `browserslist`, which would send rspack back to a config it can't fully read.
    expect(target).toEqual(['web', `browserslist:${openmrsQueries.join(', ')}`]);
  });

  it('narrows to match a module that supports older browsers', async () => {
    // The reason for deriving this rather than pinning a level: an ES2020 runtime shipped to a browser
    // this old is a syntax error, however correctly swc compiled the module's own sources.
    const root = scratchApp({ browserslist: ['ie 11'] });
    const { target } = await loadConfigFrom('rspack', root);
    const environment = await environmentFor('rspack', target);

    expect(environment.arrowFunction).toBe(false);
    expect(environment.dynamicImport).toBe(false);
    expect(environment.optionalChaining).toBe(false);
  });

  it('claims no ES feature the supported browsers lack', async () => {
    // Taken from the config rather than restated, so this tracks whatever the config declares.
    const { target } = await loadConfigFrom('rspack', fixtureRoot);
    const configured = await environmentFor('rspack', target);

    // What webpack derives from the resolved policy: the browser data's own verdict, and the only place
    // in this repo that can read it, since rspack's port cannot.
    const supported = await environmentFor('webpack', `browserslist:${openmrsTargets.join(', ')}`);

    // Proves `supported` is a real reading of the browser data rather than something empty that would
    // make the comparison below vacuous.
    expect(supported.arrowFunction).toBe(true);

    const overclaimed = Object.keys(configured).filter((feature) => configured[feature] && !supported[feature]);
    expect(overclaimed).toEqual([]);
  });

  it('is identical between the two bundlers', async () => {
    const { target: rspackTarget } = await loadConfigFrom('rspack', fixtureRoot);
    const { target: webpackTarget } = await loadConfigFrom('webpack', fixtureRoot);
    expect(rspackTarget).toEqual(webpackTarget);

    const [rspackEnvironment, webpackEnvironment] = [
      await environmentFor('rspack', rspackTarget),
      await environmentFor('webpack', webpackTarget),
    ];

    expect(rspackEnvironment).toEqual(webpackEnvironment);
    // The features a bare `web` target leaves off, which is the point of setting this at all. Also what
    // fails if rspack's bundled browser data ever ages far enough to stop resolving the policy.
    expect(rspackEnvironment.dynamicImport).toBe(true);
    expect(rspackEnvironment.globalThis).toBe(true);
  });
});

it('hands both bundlers the same targets', async () => {
  // The two configs are published separately and resolve their targets from copies of the same code, so
  // this is what catches them drifting apart and emitting differently for the same app.
  const [rspackOptions, webpackOptions] = [
    scriptLoaderOptions(await loadConfigFrom('rspack', fixtureRoot)),
    scriptLoaderOptions(await loadConfigFrom('webpack', fixtureRoot)),
  ];

  expect(rspackOptions.env.targets).toEqual(webpackOptions.env.targets);
});
