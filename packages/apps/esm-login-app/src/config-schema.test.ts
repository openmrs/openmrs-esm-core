import { describe, expect, it } from 'vitest';
import { configSchema } from './config-schema';

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
