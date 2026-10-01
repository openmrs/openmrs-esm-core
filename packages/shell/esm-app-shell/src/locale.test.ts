import { describe, expect, it, vi } from 'vitest';

type ExtensionsConfigState = { configs: Record<string, Record<string, { loaded: boolean; config: any }>> };

const extensionsConfigStore = vi.hoisted(() => {
  let state: ExtensionsConfigState = { configs: {} };
  const listeners = new Set<(state: ExtensionsConfigState) => void>();

  return {
    getState: () => state,
    setState(next: ExtensionsConfigState) {
      state = next;
      listeners.forEach((listener) => listener(state));
    },
    subscribe(listener: (state: ExtensionsConfigState) => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
});

vi.mock('@openmrs/esm-framework/src/internal', () => ({
  registerTranslationNamespace: () => {},
  importDynamic: () => Promise.resolve({ importTranslation: () => Promise.resolve({ hello: 'Bonjour' }) }),
  getExtensionsConfigStore: () => extensionsConfigStore,
  getExtensionConfigFromStore: (state: ExtensionsConfigState, slotName: string, extensionId: string) =>
    state.configs[slotName]?.[extensionId] ?? { loaded: false, config: null },
  getTranslationOverrides: (_ns: string, slotName?: string) => Promise.resolve(slotName ? [{}, {}] : [{}]),
}));

const namespace = 'ext-module___barSlot___fooExt';

describe('setupI18n', () => {
  it('applies an extension’s overrides when it mounts after its namespace was read', async () => {
    document.documentElement.setAttribute('lang', 'fr');

    const { setupI18n } = await import('./locale');
    await setupI18n();
    await window.i18next.loadNamespaces(namespace);

    expect(window.i18next.getResource('fr', namespace, 'hello')).toBe('Bonjour');

    extensionsConfigStore.setState({
      configs: {
        barSlot: {
          fooExt: { loaded: true, config: { 'Translation overrides': { fr: { hello: 'Salut' } } } },
        },
      },
    });

    expect(window.i18next.getResource('fr', namespace, 'hello')).toBe('Salut');
  });
});
