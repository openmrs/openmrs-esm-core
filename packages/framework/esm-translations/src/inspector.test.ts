import { afterEach, describe, expect, it, vi } from 'vitest';
import i18next from 'i18next';
import {
  disableTranslationInspector,
  enableTranslationInspector,
  isTranslationInspectorRecording,
  matchTranslations,
  recordTranslationSighting,
  type TranslationSighting,
} from './inspector';

const loginButton: TranslationSighting = {
  namespace: '@openmrs/esm-login-app',
  key: 'loginButton',
  value: 'Log in',
  hasCount: false,
};

const locationsHeader: TranslationSighting = {
  namespace: '@openmrs/esm-login-app',
  key: 'locationsHeader',
  value: 'Locations',
  hasCount: false,
};

const alsoLocations: TranslationSighting = {
  namespace: '@openmrs/esm-other-app',
  key: 'alsoLocations',
  value: 'Locations',
  hasCount: false,
};

afterEach(() => {
  disableTranslationInspector();
});

describe('translation inspector', () => {
  it('reports nothing until it is enabled', () => {
    recordTranslationSighting(loginButton);

    expect(isTranslationInspectorRecording()).toBe(false);
    expect(matchTranslations('Log in')).toEqual([]);
  });

  it('maps a rendered string back to the key that produced it', () => {
    enableTranslationInspector();
    recordTranslationSighting(loginButton);

    expect(isTranslationInspectorRecording()).toBe(true);
    expect(matchTranslations('Log in')).toEqual([loginButton]);
  });

  it('reports every key that renders the same string, once each', () => {
    enableTranslationInspector();
    recordTranslationSighting(locationsHeader);
    recordTranslationSighting(alsoLocations);
    recordTranslationSighting(locationsHeader);

    expect(matchTranslations('Locations')).toEqual([locationsHeader, alsoLocations]);
  });

  it('treats the same key rendered through an extension as a separate sighting', () => {
    const throughExtension = {
      ...loginButton,
      extensionNamespace: '@openmrs/esm-login-app___some-slot___some-extension',
    };

    enableTranslationInspector();
    recordTranslationSighting(loginButton);
    recordTranslationSighting(throughExtension);

    expect(matchTranslations('Log in')).toEqual([loginButton, throughExtension]);
  });

  it('matches text that has been trimmed since it was translated', () => {
    enableTranslationInspector();
    recordTranslationSighting(loginButton);

    expect(matchTranslations('  Log in  ')).toEqual([loginButton]);
  });

  it('does not match text that merely contains a translation', () => {
    enableTranslationInspector();
    recordTranslationSighting(loginButton);

    expect(matchTranslations('Please Log in now')).toEqual([]);
  });

  it('reports nothing for text that came from no translation', () => {
    enableTranslationInspector();
    recordTranslationSighting(loginButton);

    expect(matchTranslations('Kaposi sarcoma')).toEqual([]);
    expect(matchTranslations('')).toEqual([]);
  });

  it('makes room by forgetting the string rendered least recently', () => {
    const sightingOf = (value: string): TranslationSighting => ({ ...loginButton, key: value, value });

    enableTranslationInspector();
    recordTranslationSighting(sightingOf('always on screen'));

    for (let i = 0; i < 19_999; i++) {
      recordTranslationSighting(sightingOf(`string ${i}`));
      if (i === 10_000) {
        // Re-rendered part way through, so it is no longer the stalest entry.
        recordTranslationSighting(sightingOf('always on screen'));
      }
    }

    recordTranslationSighting(sightingOf('one too many'));

    expect(matchTranslations('always on screen')).toHaveLength(1);
    expect(matchTranslations('string 0')).toEqual([]);
    expect(matchTranslations('one too many')).toHaveLength(1);
  });

  it('has mounted components re-render on enabling, so text already on screen gets recorded', () => {
    const emit = vi.spyOn(i18next, 'emit');

    enableTranslationInspector();

    expect(emit).toHaveBeenCalledWith('languageChanged', i18next.language);
    emit.mockRestore();
  });

  it('forgets what it recorded once disabled', () => {
    enableTranslationInspector();
    recordTranslationSighting(loginButton);
    expect(matchTranslations('Log in')).toHaveLength(1);

    disableTranslationInspector();
    enableTranslationInspector();

    expect(matchTranslations('Log in')).toEqual([]);
  });

  it('keeps a key marked as a plural when it is also rendered without a count', () => {
    enableTranslationInspector();

    recordTranslationSighting({ namespace: 'ns', key: 'visit', value: 'Visit', hasCount: false });
    recordTranslationSighting({ namespace: 'ns', key: 'visit', value: 'Visit', hasCount: true });

    expect(matchTranslations('Visit')).toEqual([expect.objectContaining({ key: 'visit', hasCount: true })]);
  });

  it('is not affected by a caller modifying what it returned', () => {
    enableTranslationInspector();
    recordTranslationSighting({ ...loginButton });

    const matches = matchTranslations('Log in');
    matches[0].key = 'somethingElse';
    matches.length = 0;

    expect(matchTranslations('Log in')).toEqual([loginButton]);
  });

  it('is not affected by a caller modifying a sighting after recording it', () => {
    enableTranslationInspector();
    const sighting = { ...loginButton };
    recordTranslationSighting(sighting);

    sighting.key = 'somethingElse';

    expect(matchTranslations('Log in')).toEqual([loginButton]);
  });
});
