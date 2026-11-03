import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearConfigErrors, configInternalStore, defineConfigSchema, getConfig, provide } from '@openmrs/esm-config';
import { configSchema } from './config-schema';

const moduleName = '@openmrs/esm-login-app';

describe('login config schema', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    clearConfigErrors();
    configInternalStore.setState((state) => ({ ...state, providedConfigs: [] }));
    defineConfigSchema(moduleName, configSchema);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['custom', 'oauth2'])('reports a %s provider that keeps the default loginUrl', async (type) => {
    provide({ [moduleName]: { provider: { type } } });
    await getConfig(moduleName);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringMatching(
        new RegExp(`${moduleName}\\.provider: Provider type '${type}' requires an explicit loginUrl`),
      ),
    );
  });

  it('accepts a custom provider with an explicit loginUrl', async () => {
    provide({ [moduleName]: { provider: { type: 'custom', loginUrl: 'https://sso.example.org/login' } } });
    await getConfig(moduleName);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('accepts the default basic provider', async () => {
    provide({ [moduleName]: {} });
    await getConfig(moduleName);
    expect(console.error).not.toHaveBeenCalled();
  });
});
