import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import i18next from 'i18next';
import { useSession } from '@openmrs/esm-framework';
import { implementerToolsConfigStore } from '@openmrs/esm-framework/src/internal';
import {
  findOverrideSource,
  flattenBundle,
  getLoadedNamespaces,
  loadTranslationLanguage,
  loadTranslationNamespace,
  useTranslationEntries,
  useTranslationLanguages,
} from './translation-catalog';

vi.mock('../hooks', () => ({ useFrontendModules: () => [] }));

describe('flattenBundle', () => {
  it('keeps the top-level string entries', () => {
    expect(flattenBundle({ loginButton: 'Log in', locationsHeader: 'Locations' })).toEqual({
      loginButton: 'Log in',
      locationsHeader: 'Locations',
    });
  });

  it('leaves out a nested entry, which could be listed but never overridden', () => {
    // An override is written at the literal path given, while i18next resolves `errors.required` by
    // walking `errors` then `required`, so editing one here could never take effect.
    expect(flattenBundle({ loginButton: 'Log in', errors: { required: 'Required' } })).toEqual({
      loginButton: 'Log in',
    });
  });

  it('drops leaves that an override could not represent', () => {
    expect(flattenBundle({ ok: 'Fine', list: ['a', 'b'], count: 3 })).toEqual({ ok: 'Fine' });
  });

  it('tolerates a missing bundle', () => {
    expect(flattenBundle(undefined)).toEqual({});
  });
});

describe('getLoadedNamespaces', () => {
  it('lists the loaded namespaces, hiding extension-scoped ones', () => {
    window.i18next = {
      ...window.i18next,
      store: {
        data: {
          en: {
            core: {},
            '@openmrs/esm-login-app': {},
            '@openmrs/esm-login-app___some-slot___some-extension': {},
          },
        },
      },
    } as unknown as typeof window.i18next;

    expect(getLoadedNamespaces('en')).toEqual(['core', '@openmrs/esm-login-app']);
  });

  it('returns nothing for a language with no resources', () => {
    expect(getLoadedNamespaces('km')).toEqual([]);
  });
});

describe('findOverrideSource', () => {
  const overrides = {
    en: {
      loginButton: { _value: 'Sign in', _source: 'temporary config' },
    },
  };

  it('reports the config an override came from', () => {
    expect(findOverrideSource(overrides, 'en', 'loginButton')).toBe('temporary config');
  });

  it('reports nothing for a key, language, or namespace that is not overridden', () => {
    expect(findOverrideSource(overrides, 'en', 'locationsHeader')).toBeUndefined();
    expect(findOverrideSource(overrides, 'km', 'loginButton')).toBeUndefined();
    expect(findOverrideSource(undefined, 'en', 'loginButton')).toBeUndefined();
  });

  it('ignores the schema’s own default, which is not a per-key leaf', () => {
    expect(findOverrideSource({ _value: {}, _source: 'default' }, 'en', 'loginButton')).toBeUndefined();
  });
});

describe('loadTranslationNamespace', () => {
  it('also loads the fallback languages the namespace is missing, which the table lists keys from', async () => {
    const loaded = new Set(['en']);
    const reloadResources = vi.fn((lngs: Array<string>, _ns: Array<string>, done: () => void) => {
      lngs.forEach((lng) => loaded.add(lng));
      done();
    });
    window.i18next = {
      ...window.i18next,
      reloadResources,
      hasResourceBundle: (lng: string) => loaded.has(lng),
      services: { languageUtils: { toResolveHierarchy: () => ['fr-CA', 'fr', 'en'] } },
    } as unknown as typeof window.i18next;

    await loadTranslationNamespace('@openmrs/esm-login-app', 'fr-CA');

    // `en` is already loaded; `fr-CA` is always fetched, since it is the language being browsed.
    expect(reloadResources).toHaveBeenCalledWith(['fr-CA', 'fr'], ['@openmrs/esm-login-app'], expect.any(Function));
  });

  describe('with i18next’s record of each load', () => {
    const namespace = '@openmrs/esm-login-app';
    let state: Record<string, number>;
    let loaded: Set<string>;

    beforeEach(() => {
      state = {};
      loaded = new Set();
      window.i18next = {
        ...window.i18next,
        hasResourceBundle: (lng: string, ns: string) => loaded.has(`${lng}|${ns}`),
        services: { backendConnector: { state }, languageUtils: { toResolveHierarchy: () => ['en'] } },
      } as unknown as typeof window.i18next;
    });

    it('retries a namespace that failed before, which i18next would otherwise skip', async () => {
      state[`en|${namespace}`] = -1;
      window.i18next.reloadResources = vi.fn((_lngs, _ns, done) => {
        // i18next skips a pair still marked failed, so the load only happens if the mark was cleared.
        if (state[`en|${namespace}`] >= 0) {
          state[`en|${namespace}`] = 2;
          loaded.add(`en|${namespace}`);
        }
        done?.();
      }) as unknown as typeof window.i18next.reloadResources;

      await expect(loadTranslationNamespace(namespace, 'en')).resolves.toBeUndefined();
    });

    it('reports a load that failed even though i18next called back without an error', async () => {
      window.i18next.reloadResources = vi.fn((_lngs, _ns, done) => {
        state[`en|${namespace}`] = -1;
        done?.();
      }) as unknown as typeof window.i18next.reloadResources;

      await expect(loadTranslationNamespace(namespace, 'en')).rejects.toThrow(/failed; try again/);
    });

    it('ignores an error from another namespace’s load', async () => {
      window.i18next.reloadResources = vi.fn((_lngs, _ns, done) => {
        state[`en|${namespace}`] = 2;
        loaded.add(`en|${namespace}`);
        done?.([new Error('core failed')]);
      }) as unknown as typeof window.i18next.reloadResources;

      await expect(loadTranslationNamespace(namespace, 'en')).resolves.toBeUndefined();
    });

    describe('when a read never finishes', () => {
      beforeEach(() => vi.useFakeTimers());
      afterEach(() => vi.useRealTimers());

      it('gives up, and lets the next attempt start a read of its own', async () => {
        window.i18next.reloadResources = vi.fn(() => {
          state[`en|${namespace}`] = 1;
        }) as unknown as typeof window.i18next.reloadResources;

        const hung = loadTranslationNamespace(namespace, 'en');
        const assertion = expect(hung).rejects.toThrow(/did not finish/);
        await vi.advanceTimersByTimeAsync(15_000);
        await assertion;

        // Left marked as loading, i18next would attach the next attempt to the read that never ended.
        expect(state[`en|${namespace}`]).toBeUndefined();
      });

      it('gives up on loading a language whose namespace read hangs', async () => {
        loaded.add(`fr|${namespace}`);
        window.i18next.languages = ['fr'];
        window.i18next.store = { data: { fr: { [namespace]: {} } } } as unknown as typeof window.i18next.store;
        window.i18next.reloadResources = vi.fn(() => {
          state[`de|${namespace}`] = 1;
        }) as unknown as typeof window.i18next.reloadResources;

        const hung = loadTranslationLanguage('de');
        const assertion = expect(hung).rejects.toThrow(/did not finish/);
        await vi.advanceTimersByTimeAsync(15_000);
        await assertion;
      });
    });
  });
});

describe('useTranslationEntries', () => {
  async function setUpI18next(lng: string, resources: Record<string, Record<string, Record<string, string>>>) {
    const i18n = i18next.createInstance();
    await i18n.init({ lng, fallbackLng: 'en', nsSeparator: false, resources });
    window.i18next = i18n as unknown as typeof window.i18next;
    implementerToolsConfigStore.setState({ config: {} });
    return i18n;
  }

  it('lists every plural form the selected language renders through, even ones no bundle has', async () => {
    const i18n = await setUpI18next('ar', {
      en: { mod: { items_one: '{{count}} item', items_other: '{{count}} items' } },
      ar: { mod: {} },
    });

    const { result } = renderHook(() => useTranslationEntries(['mod'], 'ar'));
    const listed = result.current.filter((entry) => entry.key.startsWith('items_')).map((entry) => entry.key);

    // Overriding every listed form must change what Arabic renders for any count.
    i18n.addResourceBundle('ar', 'mod', Object.fromEntries(listed.map((key) => [key, 'AR'])), true, true);

    for (const count of [0, 1, 2, 3, 11, 100]) {
      expect(i18n.t('items', { ns: 'mod', lng: 'ar', count })).toBe('AR');
    }
  });

  it('points a base key at the plural forms of the selected language', async () => {
    await setUpI18next('ar', {
      en: { mod: { items: 'Items', items_one: '{{count}} item', items_other: '{{count}} items' } },
    });

    const { result } = renderHook(() => useTranslationEntries(['mod'], 'ar'));

    expect(result.current.find((entry) => entry.key === 'items')?.pluralForms).toEqual([
      'items_zero',
      'items_one',
      'items_two',
      'items_few',
      'items_many',
      'items_other',
    ]);
  });

  it('reads a key named like a built-in object property from the bundle that has it', async () => {
    await setUpI18next('fr', {
      fr: { mod: { save: 'Enregistrer' } },
      en: { mod: { save: 'Save', toString: 'Convert to text' } },
    });

    const { result } = renderHook(() => useTranslationEntries(['mod'], 'fr'));
    const entry = result.current.find((candidate) => candidate.key === 'toString');

    expect(entry?.value).toBe('Convert to text');
    expect(entry?.sourceLanguage).toBe('en');
  });

  it('attributes a value shown from a fallback language to the override that supplies it', async () => {
    // The backend merges the en override into the en bundle; fr has no value for the key.
    await setUpI18next('fr', { en: { mod: { greeting: 'Overridden hello' } }, fr: { mod: {} } });
    implementerToolsConfigStore.setState({
      config: {
        mod: {
          'Translation overrides': {
            en: { greeting: { _value: 'Overridden hello', _source: 'temporary config' } },
          },
        },
      },
    });

    const { result } = renderHook(() => useTranslationEntries(['mod'], 'fr'));

    expect(result.current).toEqual([
      expect.objectContaining({
        key: 'greeting',
        value: 'Overridden hello',
        sourceLanguage: 'en',
        overrideSource: 'temporary config',
      }),
    ]);
  });
});

describe('useTranslationLanguages', () => {
  it('offers each server locale as the language i18next runs it as', async () => {
    const i18n = i18next.createInstance();
    await i18n.init({ lng: 'en', fallbackLng: 'en', resources: { en: { mod: {} } } });
    window.i18next = i18n as unknown as typeof window.i18next;
    vi.mocked(useSession).mockReturnValue({
      authenticated: true,
      sessionId: '',
      allowedLocales: ['en', 'en_us', 'sw_KE', 'uz@Latn'],
    } as ReturnType<typeof useSession>);

    const { result } = renderHook(() => useTranslationLanguages('en'));

    // `uz@Latn` keeps its modifier: overrides keyed `uz-Latn` would never be read.
    expect(result.current).toEqual(['en', 'en-US', 'sw-KE', 'uz@Latn']);
  });
});
