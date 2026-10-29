import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18next, { type BackendModule } from 'i18next';
import { temporaryConfigStore } from '@openmrs/esm-framework/src/internal';
import { reloadTranslations, resetTranslationOverride, setTranslationOverride } from './translation-overrides';

const loginApp = '@openmrs/esm-login-app';

const mockReloadResources = vi.fn((_lngs: unknown, _ns: unknown, done?: (error?: unknown) => void) => done?.());
const mockHasResourceBundle = vi.fn(() => true);
const connectorState: Record<string, number> = {};

beforeEach(() => {
  for (const key of Object.keys(connectorState)) {
    delete connectorState[key];
  }

  window.i18next = {
    ...window.i18next,
    language: 'en',
    store: { data: { en: { [loginApp]: {} } } },
    reloadResources: mockReloadResources,
    hasResourceBundle: mockHasResourceBundle,
    getResourceBundle: vi.fn(() => ({})),
    removeResourceBundle: vi.fn(),
    addResourceBundle: vi.fn(),
    options: { ns: [] },
    services: { backendConnector: { state: connectorState } },
    emit: vi.fn(),
  } as unknown as typeof window.i18next;
});

afterEach(() => {
  temporaryConfigStore.setState({ config: {} });
});

describe('setTranslationOverride', () => {
  it('writes the override where the config system expects it', () => {
    setTranslationOverride(loginApp, 'en', 'loginButton', 'Sign in');

    expect(temporaryConfigStore.getState().config).toEqual({
      [loginApp]: { 'Translation overrides': { en: { loginButton: 'Sign in' } } },
    });
  });

  it('leaves every other pending config edit alone', () => {
    temporaryConfigStore.setState({
      config: {
        '@openmrs/esm-other-app': { someSetting: 'untouched' },
        [loginApp]: {
          anotherSetting: 'also untouched',
          'Translation overrides': {
            en: { locationsHeader: 'Facilities' },
            fr: { loginButton: 'Connexion' },
          },
        },
      },
    });

    setTranslationOverride(loginApp, 'en', 'loginButton', 'Sign in');

    expect(temporaryConfigStore.getState().config).toEqual({
      '@openmrs/esm-other-app': { someSetting: 'untouched' },
      [loginApp]: {
        anotherSetting: 'also untouched',
        'Translation overrides': {
          en: { locationsHeader: 'Facilities', loginButton: 'Sign in' },
          fr: { loginButton: 'Connexion' },
        },
      },
    });
  });

  it('writes a region-qualified language tag under that tag', () => {
    setTranslationOverride(loginApp, 'km-KH', 'loginButton', 'ចូល');

    expect(temporaryConfigStore.getState().config[loginApp]['Translation overrides']).toEqual({
      'km-KH': { loginButton: 'ចូល' },
    });
  });
});

describe('resetTranslationOverride', () => {
  it('removes one override and keeps its siblings', () => {
    temporaryConfigStore.setState({
      config: {
        [loginApp]: {
          'Translation overrides': {
            en: { loginButton: 'Sign in', locationsHeader: 'Facilities' },
            fr: { loginButton: 'Connexion' },
          },
        },
      },
    });

    resetTranslationOverride(loginApp, 'en', 'loginButton');

    expect(temporaryConfigStore.getState().config[loginApp]['Translation overrides']).toEqual({
      en: { locationsHeader: 'Facilities' },
      fr: { loginButton: 'Connexion' },
    });
  });

  it('does nothing for a key that was never overridden', () => {
    temporaryConfigStore.setState({ config: { [loginApp]: { 'Translation overrides': { en: {} } } } });

    expect(() => resetTranslationOverride(loginApp, 'en', 'loginButton')).not.toThrow();
    expect(temporaryConfigStore.getState().config).toEqual({
      [loginApp]: { 'Translation overrides': { en: {} } },
    });
  });
});

describe('reloadTranslations', () => {
  it('reloads the module and every extension-scoped bundle derived from it', async () => {
    window.i18next.store.data.en = {
      [loginApp]: {},
      [`${loginApp}___some-slot___some-extension`]: {},
      [`${loginApp}___other-slot___other-extension`]: {},
      '@openmrs/esm-other-app___slot___ext': {},
    };

    await reloadTranslations(loginApp, 'en');

    expect(mockReloadResources).toHaveBeenCalledWith(
      ['en'],
      [loginApp, `${loginApp}___some-slot___some-extension`, `${loginApp}___other-slot___other-extension`],
      expect.any(Function),
    );
  });

  it('re-renders the application once the reload lands', async () => {
    await reloadTranslations(loginApp, 'en');

    expect(window.i18next.emit).toHaveBeenCalledWith('languageChanged', 'en');
  });

  it('reports a reload i18next skipped, even though the old bundle is still there', async () => {
    // A failed load leaves the previous bundle in place and marks the pair -1, and i18next then
    // calls back as a success, so an absent bundle is not evidence either way.
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      connectorState[`en|${loginApp}`] = -1;
      return done?.();
    });

    await expect(reloadTranslations(loginApp, 'en')).rejects.toThrow(/try again/);
    expect(window.i18next.emit).not.toHaveBeenCalled();
  });

  it('clears a previous failure so the next attempt actually runs', async () => {
    connectorState[`en|${loginApp}`] = -1;

    await reloadTranslations(loginApp, 'en');

    expect(connectorState[`en|${loginApp}`]).toBe(0);
    expect(window.i18next.emit).toHaveBeenCalledWith('languageChanged', 'en');
  });

  it('drops a reset key from the bundle, which a reload alone would leave behind', async () => {
    // i18next's reload merges over the existing bundle, so a key the fresh payload no longer carries
    // survives — which is what resetting an override produces for a language whose file lacks it.
    const bundle: Record<string, string> = { loginButton: 'Sign in', locationsHeader: 'Locations' };
    window.i18next.getResourceBundle = vi.fn(() => bundle);

    await reloadTranslations(loginApp, 'en', 'loginButton');

    expect(bundle).toEqual({ locationsHeader: 'Locations' });
  });

  it('leaves the bundle alone when no key is being reset', async () => {
    const bundle: Record<string, string> = { loginButton: 'Sign in' };
    window.i18next.getResourceBundle = vi.fn(() => bundle);

    await reloadTranslations(loginApp, 'en');

    expect(bundle).toEqual({ loginButton: 'Sign in' });
  });

  it('reports a reload that quietly did nothing rather than reporting success', async () => {
    // i18next skips a language/namespace pair whose first load failed and calls back as though it
    // had reloaded it, so an absent bundle is the only evidence the reload did nothing.
    mockHasResourceBundle.mockReturnValue(false);

    await expect(reloadTranslations(loginApp, 'en')).rejects.toThrow(/holds no/);
    expect(window.i18next.emit).not.toHaveBeenCalled();
  });

  it('reports a failed reload rather than reporting success', async () => {
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      connectorState[`en|${loginApp}`] = -1;
      return done?.(new Error('chunk 404'));
    });

    await expect(reloadTranslations(loginApp, 'en')).rejects.toThrow('chunk 404');
    expect(window.i18next.emit).not.toHaveBeenCalled();
  });

  it('does not fail over a load error that belongs to another namespace', async () => {
    // i18next hands every waiting request every load error, whichever pair it came from.
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      connectorState['en|core'] = -1;
      return done?.([new Error('core failed')]);
    });

    await expect(reloadTranslations(loginApp, 'en')).resolves.toBeUndefined();
    expect(window.i18next.emit).toHaveBeenCalledWith('languageChanged', 'en');
  });

  it('reports a failure in an extension-scoped bundle reloaded alongside the module', async () => {
    const extension = `${loginApp}___some-slot___some-extension`;
    window.i18next.store.data.en = { [loginApp]: {}, [extension]: {} };
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      connectorState[`en|${extension}`] = -1;
      return done?.();
    });

    await expect(reloadTranslations(loginApp, 'en')).rejects.toThrow(extension);
    expect(window.i18next.emit).not.toHaveBeenCalled();
  });

  it('drops a reset key from the extension-scoped bundles too', async () => {
    const extension = `${loginApp}___some-slot___some-extension`;
    const bundles: Record<string, Record<string, string>> = {
      [loginApp]: { loginButton: 'Sign in' },
      [extension]: { loginButton: 'Sign in', other: 'kept' },
    };
    window.i18next.store.data.en = { [loginApp]: {}, [extension]: {} };
    window.i18next.getResourceBundle = vi.fn((_lng: string, ns: string) => bundles[ns]);

    await reloadTranslations(loginApp, 'en', 'loginButton');

    expect(bundles).toEqual({ [loginApp]: {}, [extension]: { other: 'kept' } });
  });

  describe('when a read never finishes', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('gives up, and lets the next save start a read of its own', async () => {
      mockReloadResources.mockImplementationOnce(() => {
        connectorState[`en|${loginApp}`] = 1;
      });

      const hung = reloadTranslations(loginApp, 'en');
      const assertion = expect(hung).rejects.toThrow(/did not finish/);
      await vi.advanceTimersByTimeAsync(15_000);
      await assertion;

      // Left marked as loading, i18next would attach the next request to the read that never ended.
      expect(connectorState[`en|${loginApp}`]).toBeUndefined();

      const next = reloadTranslations(loginApp, 'en');
      await vi.advanceTimersByTimeAsync(0);

      await expect(next).resolves.toBeUndefined();
      expect(mockReloadResources).toHaveBeenCalledTimes(2);
    });

    it('does not reload later for a save that already timed out waiting on an earlier read', async () => {
      const listeners = new Set<() => void>();
      Object.assign(window.i18next.services.backendConnector, {
        on: (_event: string, listener: () => void) => listeners.add(listener),
        off: (_event: string, listener: () => void) => listeners.delete(listener),
      });
      connectorState[`en|${loginApp}`] = 1;

      const hung = reloadTranslations(loginApp, 'en');
      const assertion = expect(hung).rejects.toThrow(/did not finish/);
      await vi.advanceTimersByTimeAsync(15_000);
      await assertion;

      // Some other namespace finishing its load.
      listeners.forEach((listener) => listener());
      await vi.advanceTimersByTimeAsync(0);

      expect(mockReloadResources).not.toHaveBeenCalled();
      expect(listeners.size).toBe(0);
    });
  });
});

describe('reloadTranslations against i18next', () => {
  /** Reads that have started, each settled by calling it. Overrides are collected as a read starts. */
  let pendingReads: Array<(error?: Error) => void>;
  let i18n: ReturnType<typeof i18next.createInstance>;

  beforeEach(async () => {
    pendingReads = [];

    const backend: BackendModule = {
      type: 'backend',
      init() {},
      read(language, namespace, callback) {
        // Like the app shell, an extension-scoped namespace takes its module's overrides.
        const moduleName = namespace.split('___')[0];
        const overrides =
          temporaryConfigStore.getState().config?.[moduleName]?.['Translation overrides']?.[language] ?? {};
        pendingReads.push((error) =>
          error ? callback(error, null) : callback(null, { loginButton: 'Log in', ...overrides }),
        );
      },
    };

    i18n = i18next.createInstance();
    await i18n.use(backend).init({ lng: 'en', fallbackLng: 'en', ns: [], initAsync: false });
    i18n.addResourceBundle('en', loginApp, { loginButton: 'Log in' });
    window.i18next = i18n as unknown as typeof window.i18next;
  });

  /** Settles every read, including those started in response to an earlier one settling. */
  async function settleReads() {
    let settled: Array<() => void>;

    do {
      await new Promise((resolve) => setTimeout(resolve, 0));
      settled = pendingReads.splice(0);
      settled.forEach((settle) => settle());
    } while (settled.length > 0);
  }

  it('applies an override saved while the application is already reading the namespace', async () => {
    i18n.reloadResources(['en'], [loginApp]);
    expect(pendingReads).toHaveLength(1);

    setTranslationOverride(loginApp, 'en', 'loginButton', 'Sign in');
    const saved = reloadTranslations(loginApp, 'en');
    await settleReads();

    await expect(saved).resolves.toBeUndefined();
    expect(i18n.getResource('en', loginApp, 'loginButton')).toBe('Sign in');
  });

  it('applies both of two saves made in quick succession', async () => {
    setTranslationOverride(loginApp, 'en', 'loginButton', 'Sign in');
    const first = reloadTranslations(loginApp, 'en');
    setTranslationOverride(loginApp, 'en', 'locationsHeader', 'Facilities');
    const second = reloadTranslations(loginApp, 'en');
    await settleReads();

    await Promise.all([first, second]);
    expect(i18n.getResource('en', loginApp, 'locationsHeader')).toBe('Facilities');
  });

  it('still applies a save made while an earlier read fails', async () => {
    i18n.reloadResources(['en'], [loginApp]);
    setTranslationOverride(loginApp, 'en', 'loginButton', 'Sign in');
    const saved = reloadTranslations(loginApp, 'en');

    pendingReads.shift()?.(new Error('chunk 404'));
    await settleReads();

    await expect(saved).resolves.toBeUndefined();
    expect(i18n.getResource('en', loginApp, 'loginButton')).toBe('Sign in');
  });

  it('applies an override to an extension whose first read is still in flight', async () => {
    const extension = `${loginApp}___some-slot___some-extension`;
    i18n.reloadResources(['en'], [extension]);

    setTranslationOverride(loginApp, 'en', 'loginButton', 'Sign in');
    const saved = reloadTranslations(loginApp, 'en');
    await settleReads();

    await expect(saved).resolves.toBeUndefined();
    expect(i18n.getResource('en', extension, 'loginButton')).toBe('Sign in');
  });

  it('removes a reset key even when an earlier read that still had it lands first', async () => {
    setTranslationOverride(loginApp, 'en', 'extraKey', 'Only an override');
    i18n.reloadResources(['en'], [loginApp]);

    resetTranslationOverride(loginApp, 'en', 'extraKey');
    const reset = reloadTranslations(loginApp, 'en', 'extraKey');
    await settleReads();

    await expect(reset).resolves.toBeUndefined();
    expect(i18n.getResource('en', loginApp, 'extraKey')).toBeUndefined();
  });
});
