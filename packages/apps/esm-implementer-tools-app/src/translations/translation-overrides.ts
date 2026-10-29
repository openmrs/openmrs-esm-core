import { cloneDeep, set, unset } from 'lodash-es';
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
  temporaryConfigStore.setState(set(cloneDeep(temporaryConfigStore.getState()), ['config', ...path], value));
}

/** Removes a locally-made override, restoring whatever the distribution's config supplies. */
export function resetTranslationOverride(namespace: string, language: string, key: string) {
  const path = [namespace, translationOverridesKey, language, key];
  clearConfigErrors(path.join('.'));

  const state = cloneDeep(temporaryConfigStore.getState());
  unset(state, ['config', ...path]);
  temporaryConfigStore.setState(state);
}

/**
 * Re-reads a namespace's translations so that a changed override takes effect without a page
 * reload. The app shell's i18next backend merges the config's overrides in as it reads a namespace,
 * so reloading is what applies an override for real rather than faking it into the resource store.
 */
export async function reloadTranslations(namespace: string, language: string, droppedKey?: string): Promise<void> {
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

            if (droppedKey) {
              dropKey(language, namespaces, droppedKey);
            }

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
 * Removes a key from the loaded bundles ahead of a reload.
 *
 * A reload merges its payload over the existing bundle rather than replacing it, so a key the fresh
 * payload no longer carries survives — which is exactly what resetting an override produces for a
 * language whose own file lacks that key. Deleting just this key leaves the rest of the bundle
 * intact; the key itself is missing until the reload lands, and stays missing until the page is
 * reloaded if it fails, which is what the failure message tells the user.
 */
function dropKey(language: string, namespaces: Array<string>, key: string) {
  for (const namespace of namespaces) {
    delete window.i18next.getResourceBundle(language, namespace)?.[key];
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
