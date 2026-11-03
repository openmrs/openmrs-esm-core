// The config system validates the temporary config restored from local storage while the module is
// still initializing. This covers that path, which is the only one where `logError` can run before the
// rest of the module body has been evaluated.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const temporaryConfigKey = 'openmrs:temporaryConfig';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('loading with a temporary config saved by the implementer tools', () => {
  it('reports an invalid extension slot config instead of failing to load', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(
      temporaryConfigKey,
      JSON.stringify({ '@openmrs/esm-some-app': { extensionSlots: { 'a-slot': { notAKey: ['x'] } } } }),
    );

    // The failure this covers happened here, at module evaluation: validation ran before the module
    // body reached the declaration `logError` reads, so the whole framework failed to initialize with
    // "can't access lexical declaration 'displayedValidationMessages' before initialization".
    await expect(import('./module-config')).resolves.toBeDefined();

    expect(error.mock.calls.flat().join(' ')).toContain("contains invalid keys 'notAKey'");
  });

  it('still loads when the temporary config is malformed in a way validation cannot describe', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(
      temporaryConfigKey,
      JSON.stringify({ '@openmrs/esm-some-app': { extensionSlots: { 'a-slot': { add: 'not-an-array' } } } }),
    );

    await expect(import('./module-config')).resolves.toBeDefined();
  });

  it('loads normally when there is no temporary config', async () => {
    await expect(import('./module-config')).resolves.toBeDefined();
  });
});
