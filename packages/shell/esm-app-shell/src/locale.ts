import * as i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { merge } from 'lodash-es';
import {
  getTranslationOverrides,
  importDynamic,
  registerTranslationNamespace,
} from '@openmrs/esm-framework/src/internal';

registerTranslationNamespace('core');

export function setupI18n() {
  const i18n = (window.i18next = i18next.default || i18next);

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
          importDynamic(ns)
            .then((module) =>
              Promise.all([getImportPromise(module, ns, language), getTranslationOverrides(ns, slotName, extensionId)]),
            )
            .then(([json, overrides]) => {
              let translations = json ?? {};

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
            })
            .catch((err: Error) => {
              callback(err, null);
            });
        }
      },
    })
    .use(initReactI18next)
    .init({
      detection: {
        order: ['querystring', 'htmlTag', 'localStorage', 'navigator'],
        lookupQuerystring: 'lang',
      },
      fallbackLng: 'en',
      nsSeparator: false,
    });
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
