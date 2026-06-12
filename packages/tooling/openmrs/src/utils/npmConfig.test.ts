import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getNpmRegistryConfiguration } from './npmConfig';

// Integration tests using the real @pnpm/npm-conf library with controlled
// .npmrc files. We redirect npm's config file lookup using environment
// variables so tests don't depend on the developer's actual .npmrc.

describe('getNpmRegistryConfiguration', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'npmconfig-test-'));
    // Point npm config to our controlled files, isolating from the host system
    process.env.npm_config_userconfig = join(tempDir, '.npmrc');
    process.env.npm_config_globalconfig = join(tempDir, 'global-npmrc');
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('reads registry from a controlled .npmrc', () => {
    writeFileSync(join(tempDir, '.npmrc'), 'registry=https://custom.registry.org/\n');

    const config = getNpmRegistryConfiguration();

    expect(config.registry).toBe('https://custom.registry.org/');
  });

  it('normalizes strict-ssl to strictSSL', () => {
    writeFileSync(join(tempDir, '.npmrc'), 'strict-ssl=false\n');

    const config = getNpmRegistryConfiguration();

    expect(config.strictSSL).toBe(false);
    expect(config).not.toHaveProperty('strict-ssl');
  });

  it('removes the __source__ key from the output', () => {
    writeFileSync(join(tempDir, '.npmrc'), 'registry=https://custom.registry.org/\n');

    const config = getNpmRegistryConfiguration();

    expect(config).not.toHaveProperty('__source__');
  });

  it('overrides registry when an argument is provided', () => {
    writeFileSync(join(tempDir, '.npmrc'), 'registry=https://original.registry.org/\n');

    const config = getNpmRegistryConfiguration('https://override.registry.org/');

    expect(config.registry).toBe('https://override.registry.org/');
  });

  it('does not set registry when the argument is null', () => {
    // With an empty .npmrc, the registry should be the npm default
    writeFileSync(join(tempDir, '.npmrc'), '');

    const config = getNpmRegistryConfiguration(null);

    // Should not have been overridden; whatever the default is (or undefined)
    expect(config.registry).not.toBe(null);
  });

  it('returns a config object even with an empty .npmrc', () => {
    writeFileSync(join(tempDir, '.npmrc'), '');

    const config = getNpmRegistryConfiguration();

    expect(typeof config).toBe('object');
  });
});
