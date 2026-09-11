// SWR has had a history of being written in ways that make module federation
// sharing hard. Here we add regression tests to try and catch any future divergences.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildFixtureApp, cleanUpFixtureBuilds, fixtureRootOf } from './build-fixture';

/** The entry points `__fixtures__/swr-app` imports directly. */
const importedByFixture = ['swr', 'swr/immutable', 'swr/infinite', 'swr/mutation', 'swr/subscription'];

const fixture = 'swr-app';
const fixtureRoot = fixtureRootOf(fixture);

afterAll(cleanUpFixtureBuilds);

/**
 * The `shared` block one of the configs produces for the fixture. Read from source for the same
 * reason `build-fixture` does: so this can't pass against a stale `dist`.
 */
async function sharedFor(bundler: 'rspack' | 'webpack') {
  const originalCwd = process.cwd();
  process.chdir(fixtureRoot);

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

    return options.shared as Record<string, unknown>;
  } finally {
    process.chdir(originalCwd);
  }
}

/**
 * The SWR entry points a build consumes from the share scope.
 *
 * The two bundlers spell a consume differently in their stats — rspack as
 * `consume shared module (default) swr@2.x`, webpack as `consume-shared-module|default|swr|…` — so
 * this reads both rather than whichever one happens to be under test.
 */
function consumedEntryPoints(moduleGraph: Record<string, string[]>) {
  const patterns = [
    /^consume shared module \(default\) (swr(?:\/\w+)?)@/,
    /^consume-shared-module\|default\|(swr(?:\/\w+)?)\|/,
  ];

  return [
    ...new Set(
      Object.keys(moduleGraph)
        .flatMap((identifier) => patterns.map((pattern) => pattern.exec(identifier)?.[1] ?? []))
        .flat(),
    ),
  ].sort();
}

describe.each(['rspack', 'webpack'] as const)('the %s config sharing SWR', (bundler) => {
  it("asks for each shared dependency by its peer range, not the module's own version", async () => {
    // Not SWR-specific, and here because this file is where the `shared` block gets inspected at all.
    // `requiredVersion` has to come from `peerDependencies`; a frontend module's package.json also has
    // a `version` field in the same scope, and reading that instead makes every consumer demand the
    // app's own version number of React, SWR and everything else. Nothing else in this repo notices —
    // the builds still succeed and every other assertion here still passes.
    const shared = (await sharedFor(bundler)) as Record<string, { requiredVersion?: unknown }>;
    const { peerDependencies } = JSON.parse(readFileSync(join(fixtureRoot, 'package.json'), 'utf8'));

    for (const [name, range] of Object.entries(peerDependencies as Record<string, string>)) {
      expect(shared[name]?.requiredVersion, `requiredVersion for ${name}`).toBe(range);
    }

    // The prefix key shares SWR's subpaths, so it answers to SWR's range too.
    expect(shared['swr/']?.requiredVersion).toBe(peerDependencies.swr);
  });

  it('shares bare `swr` alongside the `swr/` prefix', async () => {
    // The prefix alone was the whole bug: it matches every subpath and never bare `swr`, so the
    // hook implementation went unshared and, from SWR 2.3.0, carried its own cache. Asserted on the
    // config as well as on a build because it is the one key a future edit could drop without any
    // other test here noticing.
    expect(Object.keys(await sharedFor(bundler))).toEqual(expect.arrayContaining(['swr', 'swr/']));
  });

  it('builds a remote that consumes every entry point it imports', async () => {
    const { moduleGraph } = await buildFixtureApp(bundler, 'production', fixture);

    // `arrayContaining` because SWR itself decides what else gets pulled in: up to 2.2.5 the entry
    // points request `swr/_internal` by name, so it is consumed too, and from 2.3.0 it is not.
    expect(consumedEntryPoints(moduleGraph)).toEqual(expect.arrayContaining(importedByFixture));
  });

  it('consumes bare `swr`, not just its subpaths', async () => {
    // Called out on its own because this single entry point is the whole regression: every other
    // assertion here passed just as well with the arrangement that broke on SWR 2.3.0.
    const { moduleGraph } = await buildFixtureApp(bundler, 'production', fixture);

    expect(consumedEntryPoints(moduleGraph)).toContain('swr');
  });

  it('lets nothing outside SWR itself reach into the package', async () => {
    // Counting SWR's files in the graph proves nothing: the share fallbacks put them there either
    // way, and from 2.3.0 the entry points pull private chunks (`use-swr-*`, `config-context-*`)
    // along with them. What matters is *who* reaches them. Every edge into the package has to come
    // either from a share wrapper or from another of SWR's own files; an edge from application code
    // means that import bypassed the share scope and will run against its own cache.
    const { moduleGraph } = await buildFixtureApp(bundler, 'production', fixture);

    const isSwrFile = (identifier: string) => /[\\/]node_modules[\\/]swr[\\/]/.test(identifier);
    const isShareWrapper = (identifier: string) => /^(consume|provide)/.test(identifier);

    const reachedFromOutside = Object.entries(moduleGraph)
      .filter(([identifier]) => isSwrFile(identifier) && !isShareWrapper(identifier))
      .flatMap(([identifier, issuers]) =>
        issuers
          .filter((issuer) => !isSwrFile(issuer) && !isShareWrapper(issuer))
          .map((issuer) => `${issuer} -> ${identifier}`),
      );

    expect(Object.keys(moduleGraph).some((identifier) => isSwrFile(identifier))).toBe(true);
    expect(reachedFromOutside).toEqual([]);
  });
});
