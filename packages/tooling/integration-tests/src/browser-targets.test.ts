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

// Text from the body of swc's `_class_call_check` helper, which it emits to down-level the fixture's
// class. The helper *names* are useless for this: the production minifier inlines and renames every one
// of them, so asserting on `_class_call_check` passes against genuinely ES5 output. This string is
// inside a `throw new TypeError(...)` and survives minification.
const es5HelperMarker = 'Cannot call a class as a function';

const tempDirs: string[] = [];

afterAll(() => {
  cleanUpFixtureBuilds();
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
  rmSync(join(__dirname, '..', 'node_modules', '.scratch-apps'), { recursive: true, force: true });
});

/**
 * The messages a config's browserslist plugin would push onto a compilation, without running a build.
 *
 * The plugin is what carries these to somewhere a developer sees them, so this reaches into it with a
 * stub compilation rather than asserting on a `console.warn` the factory only ever emits once.
 */
function compilationWarnings(config: Record<string, any>): string {
  const plugin = config.plugins.find(
    (candidate: { constructor?: { name?: string } }) => candidate?.constructor?.name === 'BrowserslistWarningsPlugin',
  );

  if (!plugin) {
    return '';
  }

  const compilation = { warnings: [] as Array<{ message: string }> };
  plugin.apply({
    hooks: { thisCompilation: { tap: (_name: string, fn: (c: typeof compilation) => void) => fn(compilation) } },
  });

  return compilation.warnings.map((warning) => warning.message).join('\n');
}

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

  it("expands an app's `extends` query rather than leaving it to swc", async () => {
    // How every OpenMRS module in practice names the policy. swc resolves an `extends` query relative
    // to `process.cwd()` rather than the module it compiles, and aborts the process when it cannot, so
    // the expansion is what makes this independent of where the build ran from.
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
    // Sections keyed by environment. Read as a flat array this throws, and the catch below would then
    // report the module's policy as unloadable and quietly build for OpenMRS's instead.
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

    // Loading the config at all is half the assertion: how a module's browsers are chosen is not worth
    // taking down a build, let alone a running dev server.
    const config = await loadConfigFrom(bundler, root);
    expect(scriptLoaderOptions(config).env.targets).toEqual(openmrsQueries);

    // Reported as a compilation warning, not `console.warn`: the config factory runs once, before a
    // compiler exists, so a logged message appears at startup and never again on rebuild.
    expect(compilationWarnings(config)).toContain('browserslist-config-nonexistent');
  });

  it('fails the build, rather than guessing, when a config is malformed', async () => {
    // browserslist's own errors for these are clear and the developer has to act on them, so they are
    // deliberately not swallowed the way an unloadable *named* config is.
    const root = scratchApp({ browserslist: [1, 2] as unknown as string[] });

    await expect(loadConfigFrom(bundler, root)).rejects.toThrow(/browserslist/i);
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

    expect(exposedChunk).not.toContain(es5HelperMarker);
  }, 180_000);
});

describe('the bundler runtime target', () => {
  // `output.environment` decides the syntax of the runtime and chunk-loading glue a bundler writes
  // itself, which swc never sees. The two configs reach it differently — webpack-config sets
  // `output.environment` from webpack's own browserslist target handler; rspack-config passes the
  // queries as a `browserslist:` target, which rspack does resolve as queries. These checks are what
  // hold the two results together.
  const esFeatures = (environment: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(environment).filter(([key, value]) => key !== 'nodePrefixForCoreModules' && value != null),
    ) as Record<string, boolean>;

  /**
   * The ES features a bundler ends up allowing itself for a module in `root`.
   *
   * `context` has to be that same root: webpack re-reads the module's own browserslist config from it,
   * so pointing this at a directory without one would only ever exercise webpack's fallback branch and
   * never what a real build does.
   */
  async function environmentFor(bundler: (typeof bundlers)[number], root: string) {
    const config = await loadConfigFrom(bundler, root);
    const { default: bundlerModule } = bundler === 'rspack' ? await import('@rspack/core') : await import('webpack');
    const compiler = (bundlerModule as (options: unknown) => any)({
      context: root,
      target: config.target,
      output: { environment: config.output?.environment },
    });
    const { environment } = compiler.options.output;
    await new Promise<void>((res) => compiler.close(() => res()));

    return esFeatures(environment as Record<string, unknown>);
  }

  it.each(bundlers)('lets %s use everything the supported browsers allow', async (bundler) => {
    const environment = await environmentFor(bundler, fixtureRoot);

    // The features a bare `web` target leaves off, which is the point of setting this at all.
    expect(environment.dynamicImport).toBe(true);
    expect(environment.globalThis).toBe(true);
    expect(environment.arrowFunction).toBe(true);
  });

  it.each(bundlers)('narrows %s to match a module that supports older browsers', async (bundler) => {
    // An ES2020 runtime shipped to a browser this old is a syntax error, however correctly swc compiled
    // the module's own sources.
    const root = scratchApp({ browserslist: ['chrome 60'] });
    const environment = await environmentFor(bundler, root);

    expect(environment.dynamicImport).toBe(false);
    expect(environment.optionalChaining).toBe(false);
  });

  it.each(bundlers)("reads the right env section of a module's config in %s", async (bundler) => {
    // The case that was silently wrong: webpack took the inlined query list as an env name, failed to
    // match a section by it, fell back to `defaults`, and built a modern runtime for a module whose
    // production browsers were ancient — while swc correctly down-levelled that module's own sources.
    const root = scratchApp({ browserslist: { production: ['chrome 60'], defaults: ['chrome 120'] } });
    const previous = process.env.BROWSERSLIST_ENV;
    process.env.BROWSERSLIST_ENV = 'production';
    browserslist.clearCaches();

    try {
      const options = scriptLoaderOptions(await loadConfigFrom(bundler, root));
      expect(options.env.targets).toEqual(['chrome 60']);

      const environment = await environmentFor(bundler, root);
      expect(environment.optionalChaining).toBe(false);
      expect(environment.dynamicImport).toBe(false);
    } finally {
      process.env.BROWSERSLIST_ENV = previous;
      browserslist.clearCaches();
    }
  });

  it('claims no ES feature the supported browsers lack', async () => {
    const configured = await environmentFor('rspack', fixtureRoot);

    // webpack's reading of the resolved policy, straight from the browser data.
    const { default: webpack } = await import('webpack');
    const oracle = webpack({ context: fixtureRoot, target: `browserslist:${openmrsTargets.join(', ')}` } as never);
    const supported = esFeatures(oracle.options.output.environment as Record<string, unknown>);
    await new Promise<void>((res) => oracle.close(() => res()));

    // Proves `supported` is a real reading rather than something empty that would make this vacuous.
    expect(supported.arrowFunction).toBe(true);

    const overclaimed = Object.keys(configured).filter((feature) => configured[feature] && !supported[feature]);
    expect(overclaimed).toEqual([]);
  });

  it('is identical between the two bundlers', async () => {
    const [rspackEnvironment, webpackEnvironment] = [
      await environmentFor('rspack', fixtureRoot),
      await environmentFor('webpack', fixtureRoot),
    ];

    expect(rspackEnvironment).toEqual(webpackEnvironment);
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
