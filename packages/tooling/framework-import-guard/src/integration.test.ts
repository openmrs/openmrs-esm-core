import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rspack } from '@rspack/core';
import { describe, expect, it } from 'vitest';
import webpack from 'webpack';
import { FrameworkImportGuardPlugin } from './index';

/**
 * The unit tests drive the plugin's hooks directly, which means they assert the shape the plugin
 * assumes rather than the shape a bundler supplies. These build a real fixture with each bundler
 * instead, which is the only way to cover what the stubs cannot: that the hooks exist and fire in
 * the expected order, that a resolution really does carry the literal request and its issuer, that
 * an error raised where the plugin raises it fails the build, and that none of it is undone by
 * production optimisations. Every regression these catch was one the stubs let through.
 *
 * The fixture carries its own `node_modules`, so the tests neither build nor resolve any workspace
 * package and run in about a second each.
 */

interface Fixture {
  root: string;
  entry: string;
}

function fixture({ entry, peerDependencies = {} }: { entry: string; peerDependencies?: Record<string, string> }) {
  const root = mkdtempSync(join(tmpdir(), 'framework-import-guard-'));

  const addPackage = (name: string, manifest: Record<string, unknown>, source: string) => {
    const dir = join(root, 'node_modules', ...name.split('/'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'package.json'),
      JSON.stringify({ name, version: '10.0.0', main: 'index.js', ...manifest }),
    );
    writeFileSync(join(dir, 'index.js'), source);
  };

  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'fixture-app', version: '1.0.0', peerDependencies }),
  );
  writeFileSync(join(root, 'entry.js'), entry);
  writeFileSync(join(root, 'unrelated.js'), 'export const unrelated = 1;\n');

  // A stand-in framework: the facade plus the two siblings the tests reach for. Discovery reads the
  // sibling list out of this manifest exactly as it would from a real install.
  addPackage(
    '@openmrs/esm-framework',
    { dependencies: { '@openmrs/esm-state': '*', '@openmrs/esm-styleguide': '*' } },
    "export { createGlobalStore } from '@openmrs/esm-state';\n",
  );
  addPackage('@openmrs/esm-state', {}, 'export const createGlobalStore = () => ({});\n');
  addPackage('@openmrs/esm-styleguide', {}, 'export const showToast = () => {};\n');

  return { root, entry: join(root, 'entry.js') };
}

function config({ root, entry }: Fixture) {
  return {
    mode: 'production' as const,
    context: root,
    entry,
    output: { path: join(root, 'out'), filename: 'bundle.js' },
    resolve: { modules: [join(root, 'node_modules'), 'node_modules'] },
    plugins: [new FrameworkImportGuardPlugin()],
  };
}

/** Returns the guard's messages, plus whether the build failed at all. */
function build(bundler: typeof webpack | typeof rspack, target: Fixture) {
  return new Promise<{ failed: boolean; guard: Array<string>; other: Array<string> }>((settle, fail) => {
    // Both bundlers accept this config; their types disagree only on fields the fixture omits.
    (bundler as typeof webpack)(config(target) as Parameters<typeof webpack>[0], (error, stats) => {
      if (error || !stats) {
        fail(error ?? new Error('no stats'));
        return;
      }

      const messages = (stats.toJson({ all: false, errors: true }).errors ?? []).map(({ message }) => message ?? '');
      settle({
        failed: stats.hasErrors(),
        guard: messages.filter((message) => message.includes('FrameworkImportGuardPlugin')),
        other: messages.filter((message) => !message.includes('FrameworkImportGuardPlugin')),
      });
    });
  });
}

const bundlers: Array<[string, typeof webpack | typeof rspack]> = [
  ['webpack', webpack],
  ['rspack', rspack],
];

describe.each(bundlers)('%s', (name, bundler) => {
  it('fails a production build that imports a framework package directly', async () => {
    // Production means `concatenateModules` is on, which folds the offending import into a
    // scope-hoisted module. Detection has to survive that.
    const { failed, guard } = await build(
      bundler,
      fixture({
        entry: "import { createGlobalStore } from '@openmrs/esm-state';\n\nconsole.log(createGlobalStore);\n",
      }),
    );

    expect(guard).toHaveLength(1);
    expect(guard[0]).toContain('./entry.js imports @openmrs/esm-state');
    expect(failed).toBe(true);
  }, 60_000);

  it('passes a build that goes through the facade', async () => {
    const { failed, guard } = await build(
      bundler,
      fixture({
        entry:
          "import { createGlobalStore } from '@openmrs/esm-framework';\nimport { unrelated } from './unrelated.js';\n\nconsole.log(createGlobalStore, unrelated);\n",
      }),
    );

    expect(guard).toHaveLength(0);
    expect(failed).toBe(false);
  }, 60_000);

  it('allows a sibling the app peer-depends on', async () => {
    const { failed, guard } = await build(
      bundler,
      fixture({
        entry: "import { createGlobalStore } from '@openmrs/esm-state';\n\nconsole.log(createGlobalStore);\n",
        peerDependencies: { '@openmrs/esm-framework': '10.x', '@openmrs/esm-state': '10.x' },
      }),
    );

    expect(guard).toHaveLength(0);
    expect(failed).toBe(false);
  }, 60_000);

  it('reports the import even when the build has an unrelated error', async () => {
    // `optimization.emitOnErrors` is false in production, so a compilation carrying any other error
    // never reaches `afterEmit`. Reporting from there hid the violation until everything else was
    // fixed.
    const { guard, other } = await build(
      bundler,
      fixture({
        entry:
          "import { createGlobalStore } from '@openmrs/esm-state';\nimport 'a-package-that-does-not-exist';\n\nconsole.log(createGlobalStore);\n",
      }),
    );

    expect(other.length).toBeGreaterThan(0);
    expect(guard).toHaveLength(1);
  }, 60_000);
});
