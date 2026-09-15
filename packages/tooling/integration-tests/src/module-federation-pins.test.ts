// The Module Federation version is pinned in several packages at once, and the pins have to agree: the
// app shell publishes runtime helpers that remotes built by the two configs execute, and the configs
// embed their own pin in the startup guard to report skew. Nothing else makes them move together.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { valid } from 'semver';
import { describe, expect, it } from 'vitest';

const packagesRoot = resolve(__dirname, '..', '..', '..');

const packagesWithPins = [
  'tooling/rspack-config',
  'tooling/webpack-config',
  'tooling/integration-tests',
  'shell/esm-app-shell',
];

function pinsOf(packagePath: string) {
  const manifest = JSON.parse(readFileSync(resolve(packagesRoot, packagePath, 'package.json'), 'utf8'));
  const declared = { ...manifest.dependencies, ...manifest.devDependencies };

  return Object.fromEntries(
    Object.entries(declared).filter(([name]) => name.startsWith('@module-federation/')),
  ) as Record<string, string>;
}

describe('the Module Federation pins', () => {
  it('agree across every package that declares one', () => {
    const declared = packagesWithPins.flatMap((packagePath) =>
      Object.entries(pinsOf(packagePath)).map(([name, pin]) => ({ packagePath, name, pin })),
    );

    expect(declared.length).toBeGreaterThan(1);
    expect([...new Set(declared.map(({ pin }) => pin))]).toHaveLength(1);
  });

  it('are exact versions, since the configs derive the skew warning from theirs', () => {
    // A range would silently disable the warning: the configs only embed a version they can `parse`.
    for (const packagePath of ['tooling/rspack-config', 'tooling/webpack-config']) {
      const pin = pinsOf(packagePath)['@module-federation/enhanced'];
      expect(valid(pin), `${packagePath} pins @module-federation/enhanced as ${pin}`).not.toBeNull();
    }
  });

  it('agree with the bundler versions the configs are built against', () => {
    // This package runs the configs' own builds, so a bundler mismatch here would test something the
    // configs never produce.
    const bundlerPin = (packagePath: string, bundler: string) => {
      const manifest = JSON.parse(readFileSync(resolve(packagesRoot, packagePath, 'package.json'), 'utf8'));
      return { ...manifest.dependencies, ...manifest.devDependencies }[bundler];
    };

    expect(bundlerPin('tooling/integration-tests', '@rspack/core')).toBe(
      bundlerPin('tooling/rspack-config', '@rspack/core'),
    );
    expect(bundlerPin('tooling/integration-tests', 'webpack')).toBe(bundlerPin('tooling/webpack-config', 'webpack'));
  });
});
