import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { getTranslationOverrides } from '@openmrs/esm-framework/src/internal';
import {
  disableTranslationInspector,
  enableTranslationInspector,
  matchTranslations,
} from '../../../framework/esm-translations/src/inspector';

const shippedLoginApp = vi.hoisted(() => ({ loginButton: 'Log in' }));
const importTranslationCalls = vi.hoisted((): Array<string> => []);

// `locale` reaches for the framework's config system, which is far more than these tests need. The
// translation inspector, though, is deliberately the real thing: the point of these tests is that
// the post-processor `setupI18n` registers really does report what i18next renders.
vi.mock('@openmrs/esm-framework/src/internal', async () => {
  const inspector = await import('../../../framework/esm-translations/src/inspector');

  return {
    ...inspector,
    registerTranslationNamespace: vi.fn(),
    getExtensionsConfigStore: () => ({ getState: () => ({ configs: {} }), subscribe: () => () => {} }),
    getExtensionConfigFromStore: () => ({ loaded: false, config: null }),
    getTranslationOverrides: vi.fn(() => Promise.resolve([{}])),
    // One object for every read, as a bundler's cached module would be, so that a test notices if
    // the backend writes overrides into the shipped translations.
    importDynamic: vi.fn(() =>
      Promise.resolve({
        importTranslation: (file: string) => {
          importTranslationCalls.push(file);
          return Promise.resolve(shippedLoginApp);
        },
      }),
    ),
  };
});

// `km` stands in for a locale with no core translation file, which the bundler reports as a module
// that cannot be found, and `fr` for a shipped file whose chunk fails to download.
vi.mock('./core-translations', async (importOriginal) => {
  const { importCoreTranslation } = await importOriginal<typeof import('./core-translations')>();

  return {
    importCoreTranslation: (fileLocale: string) => {
      if (fileLocale === 'km') {
        return Promise.reject(Object.assign(new Error("Cannot find module './km.json'"), { code: 'MODULE_NOT_FOUND' }));
      }

      if (fileLocale === 'fr') {
        return Promise.reject(Object.assign(new Error('Loading chunk fr.json failed.'), { name: 'ChunkLoadError' }));
      }

      return importCoreTranslation(fileLocale);
    },
  };
});

const loginApp = '@openmrs/esm-login-app';
const otherApp = '@openmrs/esm-other-app';

beforeAll(async () => {
  const { setupI18n } = await import('./locale');

  // `setupI18n` freezes the instance onto `window`, so it can only be called once per test file.
  await setupI18n();

  window.i18next.addResourceBundle('en', loginApp, {
    loginButton: 'Log in',
    locationsHeader: 'Locations',
  });
  window.i18next.addResourceBundle('en', otherApp, {
    alsoLocations: 'Locations',
    itemCount_one: '{{count}} item',
    itemCount_other: '{{count}} items',
    visitCount: '{{count}} visits recorded',
    visitCount_one: '{{count}} visit',
    visitCount_other: '{{count}} visits',
    greeting: 'Welcome',
    greeting_formal: 'Good day to you',
  });
  window.i18next.addResourceBundle('en', `${loginApp}___some-slot___some-extension`, {
    loginButton: 'Sign in',
  });
});

afterEach(() => {
  disableTranslationInspector();
});

describe('the translation inspector post-processor', () => {
  it('records nothing while the inspector is switched off', () => {
    expect(window.i18next.getFixedT('en', loginApp)('loginButton')).toBe('Log in');
    expect(matchTranslations('Log in')).toEqual([]);
  });

  it('records the namespace and key behind a rendered string', () => {
    enableTranslationInspector();

    window.i18next.getFixedT('en', loginApp)('loginButton');

    expect(matchTranslations('Log in')).toEqual([
      { namespace: loginApp, extensionNamespace: undefined, key: 'loginButton', value: 'Log in', hasCount: false },
    ]);
  });

  it('reports every key that renders the same string', () => {
    enableTranslationInspector();

    window.i18next.getFixedT('en', loginApp)('locationsHeader');
    window.i18next.getFixedT('en', otherApp)('alsoLocations');

    expect(matchTranslations('Locations').map((sighting) => sighting.key)).toEqual([
      'locationsHeader',
      'alsoLocations',
    ]);
  });

  it('records the interpolated string and the plural form it came from', () => {
    enableTranslationInspector();

    const rendered = window.i18next.getFixedT('en', otherApp)('itemCount', { count: 3 });

    expect(rendered).toBe('3 items');
    expect(matchTranslations('3 items')).toEqual([
      { namespace: otherApp, extensionNamespace: undefined, key: 'itemCount_other', value: '3 items', hasCount: true },
    ]);
  });

  it('does not flag a lookup as plural when i18next did no plural handling for it', () => {
    enableTranslationInspector();

    // i18next interpolates a string `count` but resolves the base key.
    const rendered = window.i18next.getFixedT('en', otherApp)('visitCount', { count: '3' } as never);

    expect(rendered).toBe('3 visits recorded');
    expect(matchTranslations('3 visits recorded')).toEqual([
      expect.objectContaining({ key: 'visitCount', hasCount: false }),
    ]);
  });

  it('records the key a context lookup resolved', () => {
    enableTranslationInspector();

    const rendered = window.i18next.getFixedT('en', otherApp)('greeting', { context: 'formal' });

    expect(rendered).toBe('Good day to you');
    expect(matchTranslations('Good day to you').map((sighting) => sighting.key)).toEqual(['greeting_formal']);
  });

  it('records the key it was given for a lookup that rendered its default value', () => {
    enableTranslationInspector();

    window.i18next.getFixedT('en', otherApp)('notInTheFile', 'Default text');

    expect(matchTranslations('Default text').map((sighting) => sighting.key)).toEqual(['notInTheFile']);
  });

  it('separates an extension-scoped namespace from the module that owns the key', () => {
    enableTranslationInspector();

    window.i18next.getFixedT('en', `${loginApp}___some-slot___some-extension`)('loginButton');

    expect(matchTranslations('Sign in')).toEqual([
      {
        namespace: loginApp,
        extensionNamespace: `${loginApp}___some-slot___some-extension`,
        key: 'loginButton',
        value: 'Sign in',
        hasCount: false,
      },
    ]);
  });

  it('leaves a translation asked for without a namespace unrecorded', () => {
    enableTranslationInspector();

    // i18next would report its own `defaultNS` here — `translation`, which this backend refuses to
    // load — so a bogus namespace is worse than none.
    window.i18next.t('loginButton', { ns: undefined, lng: 'en' });

    expect(matchTranslations('loginButton')).toEqual([]);
  });
});

describe('the translation backend', () => {
  it('renders a Translation overrides config entry in place of the shipped string, and back', async () => {
    vi.mocked(getTranslationOverrides).mockResolvedValueOnce([{ en: { loginButton: 'Sign in' } }]);
    await window.i18next.reloadResources(['en'], [loginApp]);

    expect(window.i18next.getResource('en', loginApp, 'loginButton')).toBe('Sign in');

    // Removing the override must bring back the shipped string, not the override merged into it.
    await window.i18next.reloadResources(['en'], [loginApp]);

    expect(window.i18next.getResource('en', loginApp, 'loginButton')).toBe('Log in');
    expect(shippedLoginApp).toEqual({ loginButton: 'Log in' });
  });

  it('reads a regional locale from its underscore-named file', async () => {
    await window.i18next.reloadResources(['pt-BR'], ['core', loginApp]);

    expect(window.i18next.getResource('pt-BR', 'core', 'cancel')).toBe('Cancelar');
    expect(importTranslationCalls).toContain('./pt_BR.json');
  });

  it('applies core overrides for a locale that has no core translation file', async () => {
    vi.mocked(getTranslationOverrides).mockResolvedValueOnce([{ km: { cancel: 'បោះបង់' } }]);

    await window.i18next.reloadResources(['km'], ['core']);

    expect(window.i18next.getResource('km', 'core', 'cancel')).toBe('បោះបង់');
  });

  it('reports a core translation file that failed to load, rather than loading it as empty', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    let callbackError: unknown;

    await window.i18next.reloadResources(['fr'], ['core'], ((error: unknown) => {
      callbackError = error;
    }) as () => void);

    const state = (window.i18next.services.backendConnector as unknown as { state: Record<string, number> }).state;

    expect(state['fr|core']).toBeLessThan(0);
    expect(callbackError).toBeTruthy();
    expect(consoleError).toHaveBeenCalled();
    expect(window.i18next.hasResourceBundle('fr', 'core')).toBe(false);
    consoleError.mockRestore();
  });
});
