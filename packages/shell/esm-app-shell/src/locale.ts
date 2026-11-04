import * as i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { merge } from 'lodash-es';
import {
  type ExtensionsConfigStore,
  getExtensionConfigFromStore,
  getExtensionsConfigStore,
  getTranslationOverrides,
  importDynamic,
  registerTranslationNamespace,
} from '@openmrs/esm-framework/src/internal';
import { languageDetectionOptions } from './language-detection';

registerTranslationNamespace('core');

/**
 * Extension namespaces that were read while their extension was not mounted, so they are missing its
 * translation overrides, with the languages that were read. See {@link applyPendingExtensionOverrides}.
 */
const pendingExtensionOverrides = new Map<string, { slotName: string; extensionId: string; languages: Set<string> }>();

export function setupI18n() {
  const i18n = i18next.default || i18next;
  Object.defineProperty(window, 'i18next', {
    value: i18n,
    writable: false,
    configurable: false,
  });

  const languageChangeObserver = new MutationObserver(() => {
    i18n.changeLanguage().catch((e) => console.error('i18next failed to re-detect language', e));
  });

  languageChangeObserver.observe(document.documentElement, {
    attributeFilter: ['lang'],
    attributes: true,
  });

  i18n.on('languageChanged', () => {
    document.documentElement.setAttribute('dir', i18n.dir());
  });

  getExtensionsConfigStore().subscribe(applyPendingExtensionOverrides);

  return i18n
    .use(LanguageDetector)
    .use<i18next.BackendModule>({
      type: 'backend',
      init() {},
      read(language, namespace, callback) {
        if (namespace === 'translation') {
          callback(Error("can't handle translation namespace"), null);
        } else if (namespace === undefined || language === undefined) {
          callback(Error(), null);
        } else if (namespace === 'core') {
          Promise.all([
            import(/* webpackMode: "lazy" */ `@openmrs/esm-translations/translations/${language}.json`),
            getTranslationOverrides(namespace),
          ])
            .then(([json, [overrides]]) => {
              let translations = json?.default ?? {};

              if (language in overrides) {
                translations = merge(translations, overrides[language]);
              }

              callback(null, translations);
            })
            .catch((err: Error) => {
              callback(err, null);
            });
        } else {
          const [ns, slotName, extensionId] = namespace.split('___');
          let extensionMountedAtRead = true;
          importDynamic(ns)
            .then((module) => {
              if (slotName && extensionId) {
                extensionMountedAtRead = getExtensionConfigFromStore(
                  getExtensionsConfigStore().getState(),
                  slotName,
                  extensionId,
                ).loaded;
              }

              return Promise.allSettled([
                getImportPromise(module, ns, language),
                getTranslationOverrides(ns, slotName, extensionId),
              ]);
            })
            .then(([jsonResult, overridesResult]) => {
              // If importTranslation rejects (e.g., no translation file for this locale),
              // fall back to empty so config-provided overrides can still be applied.
              let translations = jsonResult.status === 'fulfilled' ? (jsonResult.value ?? {}) : {};
              const overrides = overridesResult.status === 'fulfilled' ? overridesResult.value : [];

              // if we have a slotName and extensionId, it means that we're only loading the namespace for that extension
              // in that slot, but we _also_ process the base translations for the namespace and any top-level config overrides
              // so here we also provide the translations for just the namespace before merging everything together
              if (slotName && extensionId) {
                if (overrides.length >= 1 && language in overrides[0]) {
                  window.i18next.addResourceBundle(
                    language,
                    ns,
                    merge(translations, overrides[0][language]),
                    true,
                    false,
                  );
                } else {
                  window.i18next.addResourceBundle(language, ns, translations, true, false);
                }
              }

              translations = merge(translations, ...overrides.filter((o) => language in o).map((o) => o[language]));

              callback(null, translations);

              if (!extensionMountedAtRead) {
                const pending = pendingExtensionOverrides.get(namespace);
                if (pending) {
                  pending.languages.add(language);
                } else {
                  pendingExtensionOverrides.set(namespace, { slotName, extensionId, languages: new Set([language]) });
                }

                // The extension may have mounted while the namespace was being read.
                applyPendingExtensionOverrides(getExtensionsConfigStore().getState());
              }
            })
            .catch((err: Error) => {
              callback(err, null);
            });
        }
      },
    })
    .use(initReactI18next)
    .init({
      detection: languageDetectionOptions,
      fallbackLng: 'en',
      nsSeparator: false,
    });
}

/**
 * An extension's translation overrides only exist while it is mounted, but i18next reads a namespace
 * once per language and never again, e.g. when a language change re-reads the namespace of an
 * extension that has since unmounted. This merges the overrides into each pending namespace's loaded
 * bundles once its extension is mounted, which happens before it renders.
 */
function applyPendingExtensionOverrides(state: ExtensionsConfigStore) {
  if (pendingExtensionOverrides.size === 0) {
    return;
  }

  for (const [namespace, { slotName, extensionId, languages }] of pendingExtensionOverrides) {
    const extensionConfig = getExtensionConfigFromStore(state, slotName, extensionId);
    if (!extensionConfig.loaded || !extensionConfig.config) {
      continue;
    }

    const overrides = (extensionConfig.config['Translation overrides'] ?? {}) as Record<string, Record<string, string>>;

    for (const language of languages) {
      if (language in overrides) {
        window.i18next.addResourceBundle(language, namespace, overrides[language], true, true);
      }
    }

    pendingExtensionOverrides.delete(namespace);
  }
}

function getImportPromise(
  module: {
    importTranslation: (language: string) => Promise<Record<string, string>>;
  },
  namespace: string,
  language: string,
) {
  if (typeof module.importTranslation !== 'function') {
    throw Error(`Module ${namespace} does not export an importTranslation function`);
  }

  if (!language) {
    return Promise.resolve({});
  } else if (language.includes('-')) {
    language = language.replace('-', '_');
  }

  const importPromise = module.importTranslation(`./${language}.json`);

  if (!(importPromise instanceof Promise)) {
    throw Error(
      `Module ${namespace} exports an importTranslation function that does not return a promise. Did you forget to set require.context mode to 'lazy'?`,
    );
  }

  return importPromise;
}
