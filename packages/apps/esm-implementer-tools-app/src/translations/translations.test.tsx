import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSession } from '@openmrs/esm-framework';
import { implementerToolsConfigStore, temporaryConfigStore } from '@openmrs/esm-framework/src/internal';
import { implementerToolsStore } from '../store';
import { Translations } from './translations.component';

const mockUseSession = vi.mocked(useSession);

// i18next hands load failures to the callback, never to the returned promise, so these mocks honour
// the callback contract the production code depends on.
const mockReloadResources = vi.fn((_lngs: unknown, _ns: unknown, done?: (error?: unknown) => void) => done?.());
const mockHasResourceBundle = vi.fn(() => true);

beforeEach(() => {
  window.i18next = {
    ...window.i18next,
    language: 'en',
    languages: ['en'],
    store: {
      data: {
        en: {
          '@openmrs/esm-login-app': {
            loginButton: 'Log in',
            locationsHeader: 'Locations',
          },
        },
      },
    },
    reloadResources: mockReloadResources,
    loadLanguages: vi.fn(),
    hasResourceBundle: mockHasResourceBundle,
    getResourceBundle: vi.fn(() => ({})),
    removeResourceBundle: vi.fn(),
    addResourceBundle: vi.fn(),
    options: { ns: [] },
    services: {
      languageUtils: {
        toResolveHierarchy: (lng: string) => (lng === 'en' ? ['en'] : [lng, 'en']),
      },
      pluralResolver: {
        getSuffixes: (lng: string) =>
          new Intl.PluralRules(lng).resolvedOptions().pluralCategories.map((category) => `_${category}`),
      },
    },
    emit: vi.fn(),
  } as unknown as typeof window.i18next;

  window.installedModules = [['@openmrs/esm-login-app', {}]] as unknown as typeof window.installedModules;

  mockUseSession.mockReturnValue({ authenticated: true, sessionId: '' });
});

afterEach(() => {
  implementerToolsConfigStore.setState({ config: {} });
  temporaryConfigStore.setState({ config: {} });
});

describe('Translations', () => {
  it('lists the keys and values of the loaded namespaces', () => {
    render(<Translations />);

    expect(screen.getByText('loginButton')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('locationsHeader')).toBeInTheDocument();
    expect(screen.getAllByText('@openmrs/esm-login-app').length).toBeGreaterThan(0);
  });

  it('searches by key and by the translated text', async () => {
    const user = userEvent.setup();
    render(<Translations />);

    const search = screen.getByRole('textbox', { name: /search translations/i });

    await user.type(search, 'Locations');

    expect(screen.getByText('locationsHeader')).toBeInTheDocument();
    expect(screen.queryByText('loginButton')).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'loginBut');

    expect(screen.getByText('loginButton')).toBeInTheDocument();
    expect(screen.queryByText('locationsHeader')).not.toBeInTheDocument();
  });

  it('writes an edited value to the temporary config and reloads the namespace', async () => {
    const user = userEvent.setup();
    render(<Translations />);

    const row = screen.getByRole('row', { name: /loginButton/ });
    await user.click(within(row).getByRole('button', { name: /edit/i }));

    const editor = within(row).getByRole('textbox');
    await user.clear(editor);
    await user.type(editor, 'Sign in');
    await user.click(within(row).getByRole('button', { name: /save/i }));

    expect(temporaryConfigStore.getState().config).toEqual({
      '@openmrs/esm-login-app': {
        'Translation overrides': {
          en: { loginButton: 'Sign in' },
        },
      },
    });
    expect(mockReloadResources).toHaveBeenCalledWith(['en'], ['@openmrs/esm-login-app'], expect.any(Function));
    expect(window.i18next.emit).toHaveBeenCalledWith('languageChanged', 'en');
  });

  it('shows where an override came from, and only offers to reset local ones', () => {
    implementerToolsConfigStore.setState({
      config: {
        '@openmrs/esm-login-app': {
          'Translation overrides': {
            en: {
              loginButton: { _value: 'Sign in', _source: 'temporary config' },
              locationsHeader: { _value: 'Facilities', _source: 'my-distro-config.json' },
            },
          },
        },
      },
    });

    render(<Translations />);

    const overriddenRow = screen.getByRole('row', { name: /loginButton/ });
    expect(within(overriddenRow).getByText('temporary config')).toBeInTheDocument();
    expect(within(overriddenRow).getByRole('button', { name: /reset to default/i })).toBeInTheDocument();

    const providedRow = screen.getByRole('row', { name: /locationsHeader/ });
    expect(within(providedRow).getByText('my-distro-config.json')).toBeInTheDocument();
    expect(within(providedRow).queryByRole('button', { name: /reset to default/i })).not.toBeInTheDocument();
  });

  it('offers every locale the server permits, as language tags', async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({
      authenticated: true,
      sessionId: '',
      allowedLocales: ['en', 'km_KH', 'fr'],
    });

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /language/i }));

    // `km_KH` is Java's form; i18next and the config system both want `km-KH`.
    expect(screen.getByRole('option', { name: 'km-KH' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'fr' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'en' })).toBeInTheDocument();
  });

  it('fetches the resources for a locale that has not been loaded yet', async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));

    // Only what the application has loaded, so not i18next's default `translation` namespace, which
    // the app shell refuses.
    expect(mockReloadResources).toHaveBeenCalledWith(['fr'], ['@openmrs/esm-login-app'], expect.any(Function));
    expect(mockReloadResources).toHaveBeenCalledTimes(1);
    expect(window.i18next.loadLanguages).not.toHaveBeenCalled();
  });

  it('does not refetch a locale i18next already holds', async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });
    window.i18next.store.data.fr = { '@openmrs/esm-login-app': { loginButton: 'Connexion' } };

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));

    expect(await screen.findByText('Connexion')).toBeInTheDocument();
    expect(mockReloadResources).not.toHaveBeenCalled();
  });

  it('says so when a module’s translations cannot be loaded', async () => {
    const user = userEvent.setup();
    // i18next reports a load failure only through the callback; the promise it returns resolves.
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => done?.(new Error('no importTranslation export')));
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-unloadable-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-unloadable-app/ }));

    expect(await screen.findByText(/no importTranslation export/)).toBeInTheDocument();
  });

  it('still says the load failed once its notification is dismissed', async () => {
    const user = userEvent.setup();
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => done?.(new Error('no importTranslation export')));
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-unloadable-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-unloadable-app/ }));
    await screen.findByText(/no importTranslation export/);

    await user.click(screen.getByRole('button', { name: /close notification/i }));

    expect(screen.queryByText(/no importTranslation export/)).not.toBeInTheDocument();
    expect(screen.getByText(/could not be loaded/i)).toBeInTheDocument();
    expect(screen.queryByText(/has no translations for this language/)).not.toBeInTheDocument();
  });

  it('does not claim a module has no translations when its bundle never arrived', async () => {
    const user = userEvent.setup();
    // i18next permanently skips a namespace whose first load failed and reports later attempts as a
    // success with nothing loaded; saying "no translations" then would be a false statement of fact.
    mockHasResourceBundle.mockReturnValue(false);
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-unloadable-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-unloadable-app/ }));

    expect(await screen.findByText(/holds no @openmrs\/esm-unloadable-app resources/)).toBeInTheDocument();
    expect(screen.queryByText(/has no translations for this language/)).not.toBeInTheDocument();
  });

  it('discards an edit in progress when the language changes', async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });
    window.i18next.store.data.fr = { '@openmrs/esm-login-app': { loginButton: 'Connexion' } };

    render(<Translations />);

    const row = screen.getByRole('row', { name: /loginButton/ });
    await user.click(within(row).getByRole('button', { name: /edit/i }));
    await user.clear(within(row).getByRole('textbox'));
    await user.type(within(row).getByRole('textbox'), 'English draft');

    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));

    // Saving here would have written the English draft as the French override.
    const frenchRow = screen.getByRole('row', { name: /loginButton/ });
    expect(within(frenchRow).queryByRole('textbox')).not.toBeInTheDocument();
    expect(within(frenchRow).getByText('Connexion')).toBeInTheDocument();
    expect(temporaryConfigStore.getState().config ?? {}).toEqual({});
  });

  it('loads the selected namespace again for a newly selected language', async () => {
    const user = userEvent.setup();
    const data = window.i18next.store.data as Record<string, Record<string, Record<string, string>>>;
    mockHasResourceBundle.mockImplementation(((lng: string, ns: string) => Boolean(data[lng]?.[ns])) as () => boolean);
    mockReloadResources.mockImplementation(((lngs: Array<string>, nss: Array<string>, done) => {
      lngs.forEach((lng) => nss.forEach((ns) => ((data[lng] ??= {})[ns] = { greeting: `${lng} greeting` })));
      done?.();
    }) as typeof mockReloadResources);
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-other-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-other-app/ }));
    expect(await screen.findByText('en greeting')).toBeInTheDocument();

    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));

    expect(mockReloadResources).toHaveBeenCalledWith(['fr'], ['@openmrs/esm-other-app'], expect.any(Function));
    expect(await screen.findByText('fr greeting')).toBeInTheDocument();
  });

  it('lists a key that only the fallback language has, with the fallback’s value', () => {
    window.i18next.language = 'fr';
    window.i18next.languages = ['fr', 'en'];
    window.i18next.store.data = {
      fr: { '@openmrs/esm-login-app': { loginButton: 'Connexion' } },
      en: { '@openmrs/esm-login-app': { loginButton: 'Log in', locationsHeader: 'Locations' } },
    } as unknown as typeof window.i18next.store.data;

    render(<Translations />);

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    // Present only in the fallback, but still something an implementer needs to override for `fr`.
    expect(screen.getByText('locationsHeader')).toBeInTheDocument();
    expect(screen.getByText('Locations')).toBeInTheDocument();
  });

  it('reads values from the selected language, not the one the application is running in', async () => {
    // i18next's own chain is ordered for the running language, so browsing `en` while the app runs
    // in `fr` must not read every value out of the French bundle.
    window.i18next.language = 'fr';
    window.i18next.languages = ['fr', 'en'];
    window.i18next.store.data = {
      fr: { '@openmrs/esm-login-app': { loginButton: 'Connexion' } },
      en: { '@openmrs/esm-login-app': { loginButton: 'Log in' } },
    } as unknown as typeof window.i18next.store.data;

    render(<Translations />);

    await userEvent.setup().click(screen.getByRole('combobox', { name: /language/i }));
    await userEvent.setup().click(screen.getByRole('option', { name: 'en' }));

    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
  });

  it('points out the plural forms that an override of the base key would miss', () => {
    window.i18next.store.data.en['@openmrs/esm-login-app'] = {
      itemCount: '{{count}} item',
      itemCount_one: '{{count}} item',
      itemCount_other: '{{count}} items',
      greeting: 'Hello',
      greeting_male: 'Hello sir',
    };

    render(<Translations />);

    // The app's react-i18next mock does not interpolate, so the hint's presence is what is
    // assertable here; the forms it lists come from `pluralForms`, covered in the catalog tests.
    const pluralRow = screen.getByRole('row', { name: /itemCount / });
    expect(within(pluralRow).getByText(/Plural forms to override too/)).toBeInTheDocument();

    // Context suffixes are arbitrary application data, so they are deliberately not guessed at.
    const contextRow = screen.getByRole('row', { name: /greeting Hello/ });
    expect(within(contextRow).queryByText(/Plural forms to override too/)).not.toBeInTheDocument();
  });

  it('drops a load the inspector’s handoff superseded, including its failure', async () => {
    const user = userEvent.setup();
    let failSlowLoad: () => void = () => {};
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      failSlowLoad = () => done?.(new Error('slow load failed'));
    });
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-slow-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-slow-app/ }));

    act(() =>
      implementerToolsStore.setState((state) => ({
        ...state,
        selectedTranslation: { namespace: '@openmrs/esm-login-app', key: 'loginButton' },
      })),
    );
    await act(async () => failSlowLoad());
    // Let the rejected load's handlers run before looking.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(screen.getByText('loginButton')).toBeInTheDocument();
    expect(screen.queryByText(/slow load failed/)).not.toBeInTheDocument();
  });

  it('narrows to a single key when the inspector hands one over', () => {
    implementerToolsStore.setState((state) => ({
      ...state,
      selectedTranslation: { namespace: '@openmrs/esm-login-app', key: 'locationsHeader' },
    }));

    render(<Translations />);

    expect(screen.getByText('locationsHeader')).toBeInTheDocument();
    expect(screen.queryByText('loginButton')).not.toBeInTheDocument();
    expect(implementerToolsStore.getState().selectedTranslation).toBeNull();
  });

  it('shows only the handed-over key, in its own namespace, until the search is edited', async () => {
    window.i18next.store.data.en = {
      '@openmrs/esm-login-app': { save: 'Save', saveDraft: 'Save draft' },
      '@openmrs/esm-other-app': { save: 'Save' },
    };
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-other-app', {}],
    ] as unknown as typeof window.installedModules;
    implementerToolsStore.setState((state) => ({
      ...state,
      selectedTranslation: { namespace: '@openmrs/esm-login-app', key: 'save' },
    }));

    render(<Translations />);

    expect(screen.getAllByRole('row', { name: /save/i })).toHaveLength(1);
    expect(screen.getByRole('row', { name: /esm-login-app save/ })).toBeInTheDocument();

    const search = screen.getByRole('textbox', { name: /search translations/i });
    await userEvent.setup().type(search, ' ');
    await userEvent.setup().type(search, '{Backspace}');

    expect(screen.getByText('saveDraft')).toBeInTheDocument();
  });

  it('loads the handed-over namespace when the browsed language does not have it', () => {
    mockHasResourceBundle.mockReturnValue(false);
    implementerToolsStore.setState((state) => ({
      ...state,
      selectedTranslation: { namespace: '@openmrs/esm-login-app', key: 'loginButton' },
    }));

    render(<Translations />);

    expect(mockReloadResources).toHaveBeenCalledWith(['en'], ['@openmrs/esm-login-app'], expect.any(Function));
    mockHasResourceBundle.mockReturnValue(true);
  });

  it('labels a value from a fallback language’s override, without offering to reset it from here', () => {
    window.i18next.language = 'fr';
    window.i18next.store.data = {
      en: { '@openmrs/esm-login-app': { loginButton: 'Sign in' } },
      fr: { '@openmrs/esm-login-app': {} },
    } as unknown as typeof window.i18next.store.data;
    implementerToolsConfigStore.setState({
      config: {
        '@openmrs/esm-login-app': {
          'Translation overrides': { en: { loginButton: { _value: 'Sign in', _source: 'temporary config' } } },
        },
      },
    });

    render(<Translations />);

    const row = screen.getByRole('row', { name: /loginButton/ });
    expect(within(row).getByText('temporary config')).toBeInTheDocument();
    // Resetting from `fr` would remove an `fr` override, which there is none of.
    expect(within(row).queryByRole('button', { name: /reset to default/i })).not.toBeInTheDocument();
  });

  it('keeps a superseded namespace load’s failure off the screen', async () => {
    const user = userEvent.setup();
    let failFirstLoad: () => void = () => {};
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      failFirstLoad = () => done?.(new Error('first load failed'));
    });
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-first-app', {}],
      ['@openmrs/esm-second-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-first-app/ }));
    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: /esm-second-app/ }));

    await act(async () => failFirstLoad());
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(screen.queryByText(/first load failed/)).not.toBeInTheDocument();
  });

  it('shows the table as loading until every load a language change started has finished', async () => {
    const user = userEvent.setup();
    const pending: Array<() => void> = [];
    const data = window.i18next.store.data as Record<string, Record<string, Record<string, string>>>;
    mockHasResourceBundle.mockImplementation(((lng: string, ns: string) => Boolean(data[lng]?.[ns])) as () => boolean);
    mockReloadResources.mockImplementation(((lngs: Array<string>, nss: Array<string>, done) => {
      pending.push(() => {
        lngs.forEach((lng) => nss.forEach((ns) => ((data[lng] ??= {})[ns] = {})));
        done?.();
      });
    }) as typeof mockReloadResources);
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });
    data.en['@openmrs/esm-empty-app'] = {};
    window.installedModules = [['@openmrs/esm-empty-app', {}]] as unknown as typeof window.installedModules;
    delete data.en['@openmrs/esm-login-app'];

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /namespace/i }));
    await user.click(screen.getByRole('option', { name: '@openmrs/esm-empty-app' }));
    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));

    // One load for the language, one for the selected namespace.
    expect(pending.length).toBeGreaterThan(1);

    await act(async () => pending.shift()?.());
    expect(screen.getByText(/loading translations/i)).toBeInTheDocument();

    await act(async () => pending.splice(0).forEach((finish) => finish()));
    expect(await screen.findByText(/has no translations for this language/)).toBeInTheDocument();
  });

  it('pulls the page back into range when the list shrinks under it', async () => {
    const user = userEvent.setup();
    const keys = Array.from({ length: 26 }, (_, i) => `key${String(i).padStart(2, '0')}`);
    const overridden = (count: number) => ({
      config: {
        '@openmrs/esm-login-app': {
          'Translation overrides': {
            en: Object.fromEntries(
              keys.slice(0, count).map((key) => [key, { _value: `Override ${key}`, _source: 'temporary config' }]),
            ),
          },
        },
      },
    });
    window.i18next.store.data.en['@openmrs/esm-login-app'] = Object.fromEntries(
      keys.map((key) => [key, `Value ${key}`]),
    );
    implementerToolsConfigStore.setState(overridden(26));

    render(<Translations />);

    await user.click(screen.getByRole('switch', { name: /only overridden/i }));
    await user.click(screen.getByRole('button', { name: /next page/i }));
    expect(screen.getByText('key25')).toBeInTheDocument();

    // Resetting the one override on the last page shrinks the list without anything resetting the page.
    act(() => implementerToolsConfigStore.setState(overridden(25)));

    expect(screen.getByText('key00')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(26);
  });

  it('keeps the editor open, holding the draft, when a save could not be applied', async () => {
    const user = userEvent.setup();
    render(<Translations />);

    const row = screen.getByRole('row', { name: /loginButton/ });
    await user.click(within(row).getByRole('button', { name: /edit/i }));
    await user.clear(within(row).getByRole('textbox'));
    await user.type(within(row).getByRole('textbox'), 'Sign in');

    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => done?.(new Error('chunk 404')));
    await user.click(within(row).getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/saved but could not be applied/)).toBeInTheDocument();
    expect(within(row).getByRole('textbox')).toHaveValue('Sign in');

    // The next save that does apply clears the failure.
    await user.click(within(row).getByRole('button', { name: /save/i }));
    expect(screen.queryByText(/saved but could not be applied/)).not.toBeInTheDocument();
  });

  it('drops the reset key from the loaded bundle so the shipped string can come back', async () => {
    const user = userEvent.setup();
    const bundle: Record<string, string> = { loginButton: 'Sign in', locationsHeader: 'Locations' };
    window.i18next.getResourceBundle = vi.fn(() => bundle);
    implementerToolsConfigStore.setState({
      config: {
        '@openmrs/esm-login-app': {
          'Translation overrides': { en: { loginButton: { _value: 'Sign in', _source: 'temporary config' } } },
        },
      },
    });

    render(<Translations />);

    const row = screen.getByRole('row', { name: /loginButton/ });
    await user.click(within(row).getByRole('button', { name: /reset to default/i }));

    expect(bundle).toEqual({ locationsHeader: 'Locations' });
  });

  it('closes the editor once a reset applies, so Save cannot write the old override back', async () => {
    const user = userEvent.setup();
    implementerToolsConfigStore.setState({
      config: {
        '@openmrs/esm-login-app': {
          'Translation overrides': { en: { loginButton: { _value: 'Sign in', _source: 'temporary config' } } },
        },
      },
    });

    render(<Translations />);

    const row = screen.getByRole('row', { name: /loginButton/ });
    await user.click(within(row).getByRole('button', { name: /edit/i }));
    await user.click(within(row).getByRole('button', { name: /reset to default/i }));

    expect(within(row).queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('fetches a language’s missing namespaces even when it already holds others', async () => {
    const user = userEvent.setup();
    const data = window.i18next.store.data as Record<string, Record<string, Record<string, string>>>;
    mockHasResourceBundle.mockImplementation(((lng: string, ns: string) => Boolean(data[lng]?.[ns])) as () => boolean);
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });
    // French was browsed before the application loaded `esm-other-app`.
    data.fr = { '@openmrs/esm-login-app': { loginButton: 'Connexion' } };
    data.en['@openmrs/esm-other-app'] = { greeting: 'Hello' };
    window.installedModules = [
      ['@openmrs/esm-login-app', {}],
      ['@openmrs/esm-other-app', {}],
    ] as unknown as typeof window.installedModules;

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));

    expect(mockReloadResources).toHaveBeenCalledWith(['fr'], ['@openmrs/esm-other-app'], expect.any(Function));
    expect(mockReloadResources).toHaveBeenCalledTimes(1);
  });

  it('keeps a superseded language load’s failure off the screen', async () => {
    const user = userEvent.setup();
    let failFrenchLoad: () => void = () => {};
    mockReloadResources.mockImplementationOnce((_lngs, _ns, done) => {
      failFrenchLoad = () => done?.(new Error('french load failed'));
    });
    mockUseSession.mockReturnValue({ authenticated: true, sessionId: '', allowedLocales: ['en', 'fr'] });

    render(<Translations />);

    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'fr' }));
    await user.click(screen.getByRole('combobox', { name: /language/i }));
    await user.click(screen.getByRole('option', { name: 'en' }));

    await act(async () => failFrenchLoad());
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(screen.queryByText(/french load failed/)).not.toBeInTheDocument();
  });

  describe('exporting changes', () => {
    const downloads: Array<{ name: string; content: Promise<unknown> }> = [];

    beforeEach(() => {
      downloads.length = 0;
      let blob: Blob;
      vi.spyOn(URL, 'createObjectURL').mockImplementation((value) => {
        blob = value as Blob;
        return 'blob:export';
      });
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
        downloads.push({ name: this.download, content: blob.text().then(JSON.parse) });
      });

      window.i18next.language = 'fr';
      window.i18next.languages = ['fr', 'en'];
      window.i18next.store.data = {
        fr: { '@openmrs/esm-login-app': { loginButton: 'Connexion', locationsHeader: 'Emplacements' } },
        en: { '@openmrs/esm-login-app': { loginButton: 'Log in', locationsHeader: 'Locations' } },
      } as unknown as typeof window.i18next.store.data;
      temporaryConfigStore.setState({
        config: {
          '@openmrs/esm-login-app': {
            'Translation overrides': { fr: { loginButton: 'Se connecter' }, en: { loginButton: 'Sign in' } },
          },
        },
      });
    });

    afterEach(() => vi.restoreAllMocks());

    const pickNamespace = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByRole('combobox', { name: /namespace/i }));
      await user.click(screen.getByRole('option', { name: '@openmrs/esm-login-app' }));
    };

    it('waits for a single namespace to be picked', () => {
      render(<Translations />);

      expect(screen.getByRole('button', { name: /download overrides/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /download for transifex/i })).toBeDisabled();
      expect(screen.getByText(/pick a namespace to export/i)).toBeInTheDocument();
    });

    it('downloads the namespace’s edits as a config file', async () => {
      const user = userEvent.setup();
      render(<Translations />);
      await pickNamespace(user);

      await user.click(screen.getByRole('button', { name: /download overrides/i }));

      expect(downloads[0].name).toBe('openmrs-esm-login-app.fr.overrides.json');
      // Only this language's edits, and nothing the user did not change.
      await expect(downloads[0].content).resolves.toEqual({
        '@openmrs/esm-login-app': { 'Translation overrides': { fr: { loginButton: 'Se connecter' } } },
      });
    });

    it('downloads the namespace’s edits as a Transifex translation file', async () => {
      const user = userEvent.setup();
      render(<Translations />);
      await pickNamespace(user);

      await user.click(screen.getByRole('button', { name: /download for transifex/i }));

      expect(downloads[0].name).toBe('fr.json');
      await expect(downloads[0].content).resolves.toEqual({ loginButton: 'Se connecter' });
    });

    it('does not offer a Transifex file for the source language', async () => {
      const user = userEvent.setup();
      render(<Translations />);
      await pickNamespace(user);
      await user.click(screen.getByRole('combobox', { name: /language/i }));
      await user.click(screen.getByRole('option', { name: 'en' }));

      expect(screen.getByRole('button', { name: /download overrides/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /download for transifex/i })).toBeDisabled();
      expect(screen.getByText(/source language in Transifex/i)).toBeInTheDocument();
    });

    it('has nothing to export for a namespace without edits in this language', async () => {
      temporaryConfigStore.setState({ config: {} });
      const user = userEvent.setup();
      render(<Translations />);
      await pickNamespace(user);

      expect(screen.getByRole('button', { name: /download overrides/i })).toBeDisabled();
      expect(screen.getByText(/no changes have been made/i)).toBeInTheDocument();
    });
  });
});
