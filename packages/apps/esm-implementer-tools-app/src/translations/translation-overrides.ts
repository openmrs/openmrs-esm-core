import { cloneDeep, isEqual, set, unset } from 'lodash-es';
import {
  clearConfigErrors,
  extensionNamespaceSeparator,
  temporaryConfigStore,
} from '@openmrs/esm-framework/src/internal';
import {
  clearFailedLoads,
  findLoadFailure,
  getNamespacesLoading,
  releaseStalledLoads,
  waitForLoadsInFlight,
  withTimeout,
} from './i18next-loads';
import { translationOverridesKey } from './translation-catalog';

/**
 * Overrides a translation by writing to the temporary config, which is the same path the rest of
 * the implementer tools take. The override therefore behaves exactly as it will in a distribution's
 * config file, and is picked up by `Download config` along with every other local edit.
 *
 * The change only reaches the screen once `reloadTranslations` has re-read the namespace.
 */
export function setTranslationOverride(namespace: string, language: string, key: string, value: string) {
  const path = [namespace, translationOverridesKey, language, key];
  clearConfigErrors(path.join('.'));
  writeOverrides(set(cloneDeep(temporaryConfigStore.getState()), ['config', ...path], value));
}

/** Removes a locally-made override, restoring whatever the distribution's config supplies. */
export function resetTranslationOverride(namespace: string, language: string, key: string) {
  const path = [namespace, translationOverridesKey, language, key];
  clearConfigErrors(path.join('.'));

  const state = cloneDeep(temporaryConfigStore.getState());
  unset(state, ['config', ...path]);
  writeOverrides(state);
}

/** Set while this module writes an override, whose caller reloads and reports on it. */
let isWritingOverride = false;

function writeOverrides(state: ReturnType<typeof temporaryConfigStore.getState>) {
  isWritingOverride = true;

  try {
    temporaryConfigStore.setState(state);
  } finally {
    isWritingOverride = false;
  }
}

/**
 * Reloads the translations whose overrides change in the temporary config through anything other
 * than `setTranslationOverride` and `resetTranslationOverride`, such as "Clear local config" or the
 * configuration editor. Without it, the old override stays on screen until the page is reloaded.
 *
 * Only namespaces already loaded for the language are reloaded; any other picks up the current
 * overrides whenever it is first read.
 *
 * @returns A function that stops watching.
 */
export function watchTranslationOverrides(): () => void {
  return temporaryConfigStore.subscribe((state, previous) => {
    if (isWritingOverride) {
      return;
    }

    for (const { namespace, language, droppedKeys } of findChangedOverrides(previous.config, state.config)) {
      const isOnScreen =
        window.i18next?.hasResourceBundle(language, namespace) ||
        getExtensionNamespaces(namespace, language).length > 0;

      if (isOnScreen) {
        reloadTranslations(namespace, language, ...droppedKeys).catch((error) =>
          console.error(`Could not apply the changed translation overrides for ${namespace} in ${language}`, error),
        );
      }
    }
  });
}

interface ChangedOverrides {
  namespace: string;
  language: string;
  /** The keys whose override was removed. */
  droppedKeys: Array<string>;
}

/** Lists the namespace and language pairs whose overrides differ between two temporary configs. */
export function findChangedOverrides(previous: unknown, next: unknown): Array<ChangedOverrides> {
  const namespaces = new Set([...Object.keys(asRecord(previous)), ...Object.keys(asRecord(next))]);

  return Array.from(namespaces).flatMap((namespace) => {
    const before = asRecord(asRecord(asRecord(previous)[namespace])[translationOverridesKey]);
    const after = asRecord(asRecord(asRecord(next)[namespace])[translationOverridesKey]);
    const languages = new Set([...Object.keys(before), ...Object.keys(after)]);

    return Array.from(languages)
      .filter((language) => !isEqual(before[language], after[language]))
      .map((language) => {
        const kept = asRecord(after[language]);

        return {
          namespace,
          language,
          droppedKeys: Object.keys(asRecord(before[language])).filter((key) => !Object.hasOwn(kept, key)),
        };
      });
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

/**
 * Re-reads a namespace's translations so that a changed override takes effect without a page
 * reload. The app shell's i18next backend merges the config's overrides in as it reads a namespace,
 * so reloading is what applies an override for real rather than faking it into the resource store.
 *
 * @param droppedKeys Keys whose override was removed. A reload alone would leave their old value.
 */
export async function reloadTranslations(
  namespace: string,
  language: string,
  ...droppedKeys: Array<string>
): Promise<void> {
  const i18n = window.i18next;
  const namespaces = [namespace, ...getExtensionNamespaces(namespace, language)];
  const abandon = new AbortController();

  try {
    await withTimeout(
      // A read already in flight, whether an earlier save's or the application's own, collected its
      // overrides before this one was written, and would land over anything done to the bundle now.
      waitForLoadsInFlight([language], namespaces, abandon.signal).then(
        () =>
          new Promise<void>((resolve, reject) => {
            clearFailedLoads([language], namespaces);

            dropKeys(language, namespaces, droppedKeys);

            const done = (error?: unknown) => {
              const failure = findLoadFailure([language], namespaces, error);
              return failure ? reject(failure) : resolve();
            };

            // i18next declares this callback as taking no arguments but calls it with the load error.
            i18n.reloadResources([language], namespaces, done as () => void);
          }),
      ),
      `Reloading ${namespace} for ${language} did not finish`,
    );
  } catch (error) {
    abandon.abort();
    releaseStalledLoads([language], namespaces);
    throw error;
  }

  // Mounted components only re-read their translations on `languageChanged`; react-i18next leaves
  // the resource store's own `added` event unbound (`bindI18nStore` defaults to '').
  i18n.emit('languageChanged', i18n.language);
}

/**
 * Removes keys from the loaded bundles ahead of a reload.
 *
 * A reload merges its payload over the existing bundle rather than replacing it, so a key the fresh
 * payload no longer carries survives — which is exactly what resetting an override produces for a
 * language whose own file lacks that key. Deleting just these keys leaves the rest of the bundle
 * intact; each is missing until the reload lands, and stays missing until the page is reloaded if
 * it fails, which is what the failure message tells the user.
 */
function dropKeys(language: string, namespaces: Array<string>, keys: Array<string>) {
  for (const namespace of namespaces) {
    const bundle = window.i18next.getResourceBundle(language, namespace);

    for (const key of keys) {
      delete bundle?.[key];
    }
  }
}

/**
 * The extension-scoped bundles derived from a namespace. They are loaded separately from the
 * module's own bundle but merge the module's overrides in, so they go stale unless reloaded
 * alongside it. One whose first read is still in flight has no bundle yet, but that read collected
 * the old overrides, so it counts too.
 */
function getExtensionNamespaces(namespace: string, language: string): Array<string> {
  const loaded = Object.keys(window.i18next?.store?.data?.[language] ?? {});

  return Array.from(new Set([...loaded, ...getNamespacesLoading(language)])).filter((candidate) =>
    candidate.startsWith(`${namespace}${extensionNamespaceSeparator}`),
  );
}
