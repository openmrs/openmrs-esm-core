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

/**
 * The provider validator is a cross-field one: whether `loginUrl` is acceptable depends on `type`.
 * It is therefore declared on `provider` rather than on either field, and these tests pin that,
 * because declaring it at the schema root instead is both easy to do and silently useless: it would
 * be handed the whole module config, where `type` and `loginUrl` do not exist, and so would pass
 * for every possible configuration.
 */
const [validateProvider] = configSchema.provider._validators;

describe('the login provider configuration', () => {
  it.each(['custom', 'oauth2'])('rejects the default loginUrl when the provider is %s', (type) => {
    expect(validateProvider({ type, loginUrl: '${openmrsSpaBase}/login' })).toEqual(
      expect.stringContaining('requires an explicit loginUrl'),
    );
  });

  it.each(['custom', 'oauth2'])('accepts an explicit loginUrl when the provider is %s', (type) => {
    expect(validateProvider({ type, loginUrl: 'https://id.example.org/login' })).toBeUndefined();
  });

  it('does not care about loginUrl for the basic provider, which does not use it', () => {
    expect(validateProvider({ type: 'basic', loginUrl: '${openmrsSpaBase}/login' })).toBeUndefined();
  });

  it('names the offending provider type in its message', () => {
    expect(validateProvider({ type: 'oauth2', loginUrl: '${openmrsSpaBase}/login' })).toEqual(
      expect.stringContaining("'oauth2'"),
    );
  });
});
