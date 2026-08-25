// The names published here are read by remote entries built separately from the app shell, so nothing
// else in this build would notice a rename or the call in `index.ts` being dropped.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const shellRoot = resolve(__dirname, '..');

describe('the Module Federation runtime the app shell publishes for remotes', () => {
  it('publishes the runtime helpers under the names remote entries read', async () => {
    expect(globalThis._FEDERATION_SDK).toBeUndefined();
    expect(globalThis._FEDERATION_ERROR_CODES).toBeUndefined();

    const { publishFederationRuntime } = await import('./federation-runtime');
    publishFederationRuntime();

    // Indexed by string so a rename in the module can't rename the assertion along with it.
    expect(Object.keys(globalThis['_FEDERATION_SDK'] ?? {}).length).toBeGreaterThan(0);
    expect(Object.keys(globalThis['_FEDERATION_ERROR_CODES'] ?? {}).length).toBeGreaterThan(0);
  });

  it('is configured to publish the runtime that remote entries expect', () => {
    // Dropping `provideExternalRuntime` — or giving the app shell `exposes`, which makes Module Federation
    // reject it — breaks every app in the distribution.
    const originalCwd = process.cwd();
    process.chdir(shellRoot);

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const config = require(resolve(shellRoot, 'rspack.config.js'))({}, { mode: 'production' });
      const federationOptions = config.plugins.find(
        (plugin: { constructor?: { name?: string } }) => plugin?.constructor?.name === 'ModuleFederationPlugin',
      )?._options;

      expect(federationOptions?.experiments?.provideExternalRuntime).toBe(true);
      expect(federationOptions?.exposes).toBeUndefined();
    } finally {
      process.chdir(originalCwd);
    }
  }, 60_000);

  it('is called by the app shell entry, before anything that can load a remote', () => {
    const statements = readFileSync(resolve(__dirname, 'index.ts'), 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('//') && !line.startsWith('*') && !line.startsWith('/*'));

    // Remotes are only loaded from code reached via `initializeSpa`, so anywhere ahead of the first
    // function declaration is early enough.
    const callIndex = statements.indexOf('publishFederationRuntime();');
    expect(callIndex).toBeGreaterThan(-1);
    expect(callIndex).toBeLessThan(statements.findIndex((line) => line.startsWith('function ')));
  });
});
