// Compiled JSX calls into `react/jsx-runtime`, which reads React's internals as soon as it loads. A
// frontend module that bundles its own copy pairs it with whichever React the app shell provides, and
// the two only work together when they come from the same React build. So the runtime is shared like
// React itself, and these tests check which of React's entry points a remote consumes and that the app
// shell provides every one of them.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildAppShell, buildFixtureApp, cleanUpFixtureBuilds, fixtureRootOf } from './build-fixture';

const fixture = 'jsx-app';

afterAll(cleanUpFixtureBuilds);

/**
 * The `shared` block one of the configs produces for a fixture. Read from source for the same reason
 * `build-fixture` does: so this can't pass against a stale `dist`.
 */
async function sharedFor(bundler: 'rspack' | 'webpack', fixtureName: string) {
  const originalCwd = process.cwd();
  process.chdir(fixtureRootOf(fixtureName));

  try {
    const configModule =
      bundler === 'rspack'
        ? await import('@openmrs/rspack-config/src/index')
        : /* webpack */ await import('@openmrs/webpack-config/src/index');
    const config = configModule.default({}, { mode: 'production' }) as Record<string, any>;
    const federation = config.plugins.find(
      (plugin: { constructor?: { name?: string } }) => plugin?.constructor?.name === 'ModuleFederationPlugin',
    );
    const options = federation._options ?? federation.options ?? federation._pluginOptions;

    return options.shared as Record<string, { requiredVersion?: unknown }>;
  } finally {
    process.chdir(originalCwd);
  }
}

const reactEntryPoint = '(react(?:-dom)?(?:/[\\w-]+)?)';

/**
 * React's entry points a build consumes from the share scope. Rspack spells a consume as
 * `consume shared module (default) react@18.x`, webpack as `consume-shared-module|default|react|…`.
 */
function consumedReactEntryPoints(moduleGraph: Record<string, string[]>) {
  const patterns = [
    new RegExp(`^consume shared module \\(default\\) ${reactEntryPoint}@`),
    new RegExp(`^consume-shared-module\\|default\\|${reactEntryPoint}\\|`),
  ];

  return [
    ...new Set(
      Object.keys(moduleGraph)
        .flatMap((identifier) => patterns.map((pattern) => pattern.exec(identifier)?.[1] ?? []))
        .flat(),
    ),
  ].sort();
}

/** React's entry points a build publishes into the share scope for other builds to consume. */
function providedReactEntryPoints(moduleGraph: Record<string, string[]>) {
  const pattern = new RegExp(`^provide shared module \\(default\\) ${reactEntryPoint}@`);

  return [...new Set(Object.keys(moduleGraph).flatMap((identifier) => pattern.exec(identifier)?.[1] ?? []))].sort();
}

describe.each(['rspack', 'webpack'] as const)('the %s config sharing the React runtime', (bundler) => {
  it("shares the React subpaths under their package's peer range", async () => {
    const shared = await sharedFor(bundler, 'remote-app');
    const { peerDependencies } = JSON.parse(readFileSync(join(fixtureRootOf('remote-app'), 'package.json'), 'utf8'));

    expect(shared['react/jsx-runtime']?.requiredVersion).toBe(peerDependencies.react);
    expect(shared['react-dom/client']?.requiredVersion).toBe(peerDependencies['react-dom']);
    expect(shared).not.toHaveProperty(['react/jsx-dev-runtime']);
  });

  it.each(['development', 'production'])(
    'compiles JSX against the shared `react/jsx-runtime` in %s mode',
    async (mode) => {
      // Never the development runtime: `openmrs develop` builds the remote in development mode but serves
      // a production app shell, which has no development runtime to share. The remote's own copy would then
      // run against production React and throw on its first warning, such as a list item without a key.
      const { moduleGraph } = await buildFixtureApp(bundler, mode, fixture);
      const consumed = consumedReactEntryPoints(moduleGraph);

      expect(consumed).toContain('react/jsx-runtime');
      expect(consumed).not.toContain('react/jsx-dev-runtime');
    },
  );

  it('bundles `react-dom/client` itself when `react-dom` is not a peer', async () => {
    // A subpath follows its package. Sharing it alone would hand the module the app shell's renderer
    // while the rest of `react-dom` stays bundled with the module.
    const { moduleGraph } = await buildFixtureApp(bundler, 'production', fixture);

    expect(consumedReactEntryPoints(moduleGraph)).not.toContain('react-dom/client');
  });
});

describe('the app shell sharing the React runtime', () => {
  it('provides `react/jsx-runtime` and `react-dom/client` alongside React', async () => {
    const { moduleGraph } = await buildAppShell();

    expect(providedReactEntryPoints(moduleGraph)).toEqual(
      expect.arrayContaining(['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime']),
    );
  }, 180_000);

  it('provides every React entry point a development build of a frontend module consumes', async () => {
    // The pairing `openmrs develop` produces: a production app shell and a development-mode remote. An
    // entry point the remote consumes but the shell never provides falls back to the remote's own copy.
    const [{ moduleGraph: shell }, ...remotes] = await Promise.all([
      buildAppShell(),
      buildFixtureApp('rspack', 'development', fixture),
      buildFixtureApp('webpack', 'development', fixture),
    ]);

    for (const { moduleGraph } of remotes) {
      expect(providedReactEntryPoints(shell)).toEqual(expect.arrayContaining(consumedReactEntryPoints(moduleGraph)));
    }
  }, 180_000);
});
