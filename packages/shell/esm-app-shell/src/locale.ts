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
  extensionNamespaceSeparator,
  isTranslationInspectorRecording,
  recordTranslationSighting,
  registerTranslationNamespace,
} from '@openmrs/esm-framework/src/internal';
import { importCoreTranslation } from './core-translations';
import { languageDetectionOptions } from './language-detection';

registerTranslationNamespace('core');

/** The name i18next knows the translation inspector's post-processor by. */
const translationInspectorPostProcessorName = 'openmrsTranslationInspector';

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
          Promise.allSettled([
            importCoreTranslation(toTranslationFileLocale(language)),
            getTranslationOverrides(namespace),
          ])
            .then(([jsonResult, overridesResult]) => {
              // A locale with no core translation file still gets its overrides, but a file that failed
              // to load is a failure: treating it as empty would mark the namespace loaded and leave
              // every core string in English.
              if (jsonResult.status === 'rejected' && !isMissingModule(jsonResult.reason)) {
                console.error(`Failed to load the core translations for ${language}`, jsonResult.reason);
                callback(jsonResult.reason, null);
                return;
              }

              // `merge` mutates its target, and `json.default` is the cached module's own object, so
              // overrides must be merged into a fresh object or they are written into the shipped
              // translations for the life of the page and can never be removed.
              let translations = { ...(jsonResult.status === 'fulfilled' ? (jsonResult.value?.default ?? {}) : {}) };
              const [overrides] = overridesResult.status === 'fulfilled' ? overridesResult.value : [{}];

              if (language in overrides) {
                translations = merge({}, translations, overrides[language]);
              }

              callback(null, translations);
            })
            .catch((err: Error) => {
              callback(err, null);
            });
        } else {
          const [ns, slotName, extensionId] = namespace.split(extensionNamespaceSeparator);
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
              let translations = { ...(jsonResult.status === 'fulfilled' ? (jsonResult.value ?? {}) : {}) };
              const overrides = overridesResult.status === 'fulfilled' ? overridesResult.value : [];

              // if we have a slotName and extensionId, it means that we're only loading the namespace for that extension
              // in that slot, but we _also_ process the base translations for the namespace and any top-level config overrides
              // so here we also provide the translations for just the namespace before merging everything together
              if (slotName && extensionId) {
                if (overrides.length >= 1 && language in overrides[0]) {
                  window.i18next.addResourceBundle(
                    language,
                    ns,
                    merge({}, translations, overrides[0][language]),
                    true,
                    false,
                  );
                } else {
                  window.i18next.addResourceBundle(language, ns, translations, true, false);
                }
              }

              translations = merge({}, translations, ...overrides.filter((o) => language in o).map((o) => o[language]));

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
    .use(translationInspector)
    .use(initReactI18next)
    .init({
      detection: languageDetectionOptions,
      fallbackLng: 'en',
      nsSeparator: false,
      postProcess: [translationInspectorPostProcessorName],
      // Gives post-processors the key that actually resolved, e.g. `visit_one` for a plural lookup.
      postProcessPassResolved: true,
    });
}

/**
 * Reports every translated string, and the key behind it, to the framework's translation inspector,
 * which the implementer tools use to tell an implementer which key to override for a given piece of
 * text on screen.
 *
 * i18next applies post-processors last, after interpolation and nesting, so `value` is the finished
 * string rather than the template — which is what lets text found in the DOM be matched back to a
 * key.
 */
const translationInspector: i18next.PostProcessorModule = {
  type: 'postProcessor',
  name: translationInspectorPostProcessorName,
  process(value, key, options) {
    if (!isTranslationInspectorRecording() || typeof value !== 'string' || value === '') {
      return value;
    }

    const namespace = resolveNamespace(options);

    if (namespace) {
      recordTranslationSighting({
        namespace: namespace.split(extensionNamespaceSeparator)[0],
        extensionNamespace: namespace.includes(extensionNamespaceSeparator) ? namespace : undefined,
        key: resolveKey(key, options),
        value,
        // Mirrors i18next, which applies plural handling to any `count` but a string.
        hasCount: options?.count !== undefined && typeof options.count !== 'string',
      });
    }

    return value;
  },
};

/**
 * The namespace a translation was looked up in. react-i18next binds it through `getFixedT`, and the
 * framework's `translateFrom` and `getCoreTranslation` pass it explicitly, so only a bare
 * `i18n.t(key)` arrives without one. Those are left unrecorded rather than guessed at.
 */
function resolveNamespace(options: i18next.TOptions) {
  const ns = options?.ns;

  if (typeof ns === 'string') {
    return ns;
  }

  return Array.isArray(ns) && typeof ns[0] === 'string' ? ns[0] : undefined;
}

/**
 * The key a translation was read from, which for a plural or context lookup is a suffixed form of the
 * key `t` was given. A lookup that found nothing, and so rendered its default value, reports the key
 * it was given, since that is the one an override would supply.
 */
function resolveKey(key: string | Array<string>, options: i18next.TOptions): string {
  const resolved = (options as { i18nResolved?: { res?: unknown; exactUsedKey?: string } })?.i18nResolved;

  if (resolved?.res !== undefined && resolved.exactUsedKey) {
    return resolved.exactUsedKey;
  }

  return Array.isArray(key) ? key[0] : key;
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
  }

  const importPromise = module.importTranslation(`./${toTranslationFileLocale(language)}.json`);

  if (!(importPromise instanceof Promise)) {
    throw Error(
      `Module ${namespace} exports an importTranslation function that does not return a promise. Did you forget to set require.context mode to 'lazy'?`,
    );
  }

  return importPromise;
}

/** Translation files are named with an underscore for the locale's first hyphen: `pt-BR` is read from `pt_BR.json`. */
function toTranslationFileLocale(language: string) {
  return language.replace('-', '_');
}

/**
 * Whether an import failed because the bundle has no such file, as opposed to failing to fetch one it
 * does have. The bundler's lazy context reports a missing file with Node's `MODULE_NOT_FOUND` code.
 */
function isMissingModule(error: unknown) {
  return (error as { code?: unknown } | null)?.code === 'MODULE_NOT_FOUND';
}
