import { describe, expect, it } from 'vitest';
import { getLocalEdits, toFileSafeName, toOverrideFile, toTransifexLocale } from './translation-exports';

describe('getLocalEdits', () => {
  const config = {
    '@openmrs/esm-login-app': {
      'Translation overrides': { fr: { loginButton: 'Se connecter', broken: { nested: 'x' } }, en: { other: 'y' } },
    },
  };

  it('returns the string overrides for just that namespace and language', () => {
    expect(getLocalEdits(config, '@openmrs/esm-login-app', 'fr')).toEqual({ loginButton: 'Se connecter' });
  });

  it('returns nothing where no edits were made', () => {
    expect(getLocalEdits(config, '@openmrs/esm-login-app', 'ar')).toEqual({});
    expect(getLocalEdits(config, '@openmrs/esm-other-app', 'fr')).toEqual({});
    expect(getLocalEdits(undefined, '@openmrs/esm-login-app', 'fr')).toEqual({});
  });
});

describe('toOverrideFile', () => {
  it('nests the edits the way a distribution config takes them', () => {
    expect(toOverrideFile('core', 'fr', { save: 'Enregistrer' })).toEqual({
      core: { 'Translation overrides': { fr: { save: 'Enregistrer' } } },
    });
  });
});

describe('toTransifexLocale', () => {
  it('uses the underscore form the translation files are named with', () => {
    expect(toTransifexLocale('ar-SY')).toBe('ar_SY');
    expect(toTransifexLocale('ar')).toBe('ar');
  });
});

describe('toFileSafeName', () => {
  it('drops the scope marker and path separator', () => {
    expect(toFileSafeName('@openmrs/esm-login-app')).toBe('openmrs-esm-login-app');
    expect(toFileSafeName('core')).toBe('core');
  });
});
