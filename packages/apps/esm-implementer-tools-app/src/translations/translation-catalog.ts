import { useEffect, useMemo, useState } from 'react';
import { useSession } from '@openmrs/esm-framework';
import {
  extensionNamespaceSeparator,
  implementerToolsConfigStore,
  useStore,
} from '@openmrs/esm-framework/src/internal';
import { useFrontendModules } from '../hooks';
import { clearFailedLoads, findLoadFailure, releaseStalledLoads, withTimeout } from './i18next-loads';

/** The namespace holding the framework's own translations. It belongs to no frontend module. */
export const coreNamespace = 'core';

/** The reserved config property through which translations are overridden. */
export const translationOverridesKey = 'Translation overrides';

/**
 * The `_source` the config system attributes to values set through the implementer tools. Only those
 * can be reset from here; anything else comes from a config the distribution supplies.
 */
export const temporaryConfigSource = 'temporary config';

export interface TranslationNamespace {
  name: string;
  /** Whether i18next holds resources for this namespace, in which case its keys are browsable. */
  isLoaded: boolean;
}

export interface TranslationEntry {
  namespace: string;
  key: string;
  /** The value i18next holds for the key, before interpolation. An override, where one applies. */
  value: string;
  /**
   * The name of the config that supplies an override for this key in `sourceLanguage`, if any.
   * `undefined` means the value comes from the namespace's translation file.
   */
  overrideSource?: string;
  /**
   * The language the value was actually read from. It differs from the selected one when the key is
   * missing from that language's bundle and i18next would fall back, which an implementer needs to
   * see before treating the value as the text they are overriding.
   */
  sourceLanguage: string;
  /**
   * The plural forms the selected language renders this key through, when the key has any. i18next
   * prefers a suffixed form over the base key, so overriding the base alone leaves these untouched.
   */
  pluralForms: Array<string>;
}

/**
 * The plural categories i18next suffixes a key with. Context variants (`_male` and the like) are not
 * guessed at: the suffix is arbitrary application data, so detecting one would report unrelated keys
 * as variants of each other.
 */
const pluralSuffixes = ['zero', 'one', 'two', 'few', 'many', 'other'];

const pluralFormPattern = new RegExp(`^(.+)_(${pluralSuffixes.join('|')})$`);

/** The key a plural form belongs to, such as `items` for `items_few`. */
function getPluralBase(key: string): string | undefined {
  return pluralFormPattern.exec(key)?.[1];
}

/**
 * Lists the namespaces whose translations can be browsed: everything i18next has loaded, plus every
 * installed frontend module, so that a module the user has not visited yet can still be loaded on
 * demand via `loadTranslationNamespace`.
 */
export function useTranslationNamespaces(language: string): Array<TranslationNamespace> {
  const frontendModules = useFrontendModules();
  const revision = useI18nextRevision();

  return useMemo(() => {
    const loaded = getLoadedNamespaces(language);
    const names = new Set([coreNamespace, ...frontendModules.map((module) => module.name), ...loaded]);

    return Array.from(names)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name, isLoaded: loaded.includes(name) }));
  }, [frontendModules, language, revision]);
}

/**
 * Builds the browsable list of translations for the given namespaces and language.
 *
 * Keys are collected across i18next's whole language resolution hierarchy rather than from the
 * selected language alone: a key that only exists in the fallback language still renders in the UI,
 * and is still something an implementer needs to be able to override for their own language. For
 * the same reason, every plural form the selected language needs is listed, even one no bundle has.
 */
export function useTranslationEntries(namespaces: Array<string>, language: string): Array<TranslationEntry> {
  const { config } = useStore(implementerToolsConfigStore);
  const revision = useI18nextRevision();

  return useMemo(() => {
    const languages = getResolutionHierarchy(language);
    const pluralFormSuffixes = window.i18next?.services?.pluralResolver?.getSuffixes?.(language) ?? [];

    return namespaces.flatMap((namespace) => {
      const bundles = languages.map((lng) => flattenBundle(window.i18next?.store?.data?.[lng]?.[namespace]));
      const bundleKeys = new Set(bundles.flatMap((bundle) => Object.keys(bundle)));
      const pluralKeys = new Set(Array.from(bundleKeys, getPluralBase).filter((base) => base !== undefined));
      const getPluralForms = (key: string) =>
        pluralKeys.has(key) ? pluralFormSuffixes.map((suffix) => `${key}${suffix}`) : [];
      const keys = Array.from(new Set([...bundleKeys, ...Array.from(pluralKeys).flatMap(getPluralForms)])).sort(
        (a, b) => a.localeCompare(b),
      );
      const overrides = config?.[namespace]?.[translationOverridesKey];

      return keys.map((key) => {
        const source = bundles.findIndex((bundle) => Object.hasOwn(bundle, key));
        const sourceLanguage = languages[source === -1 ? 0 : source];

        return {
          namespace,
          key,
          value: source === -1 ? '' : bundles[source][key],
          sourceLanguage,
          overrideSource: findOverrideSource(overrides, sourceLanguage, key),
          pluralForms: getPluralForms(key),
        };
      });
    });
  }, [config, namespaces, language, revision]);
}

/**
 * Loads a namespace's resources for the language being browsed, and for any of its fallback
 * languages not loaded yet, since the table also lists the keys only a fallback language has.
 *
 * `reloadResources` rather than `loadNamespaces` because the latter fetches for i18next's active
 * language, which is not necessarily the one selected here.
 */
export function loadTranslationNamespace(namespace: string, language: string): Promise<void> {
  const languages = getResolutionHierarchy(language).filter(
    (candidate) => candidate === language || !window.i18next.hasResourceBundle(candidate, namespace),
  );

  clearFailedLoads(languages, [namespace]);

  return withTimeout(
    new Promise<void>((resolve, reject) => {
      const done = (error?: unknown) => {
        const failure = findLoadFailure(languages, [namespace], error);
        return failure ? reject(failure) : resolve();
      };

      // i18next declares this callback as taking no arguments but calls it with the load error.
      // It expands a language into its fallbacks only when given a single string, so they are listed.
      window.i18next.reloadResources(languages, [namespace], done as () => void);
    }),
    `Loading ${namespace} for ${language} did not finish`,
  ).catch((error) => {
    releaseStalledLoads(languages, [namespace]);
    throw error;
  });
}

/**
 * The languages an implementer can author overrides for: every locale the server permits, plus
 * anything i18next has already loaded, plus whatever is currently selected.
 *
 * The server's list is the authoritative one, and it is what makes a locale the user is not running
 * in reachable at all. Each locale is listed as the language i18next runs it as, which is the key its
 * `Translation overrides` are read under.
 */
export function useTranslationLanguages(selectedLanguage: string): Array<string> {
  const session = useSession();
  const revision = useI18nextRevision();

  return useMemo(() => {
    // As `setUserLanguage` does, then normalised as i18next normalises the language it runs in.
    const allowed = (session?.allowedLocales ?? []).map((locale) => {
      const language = locale.replaceAll('_', '-');
      return window.i18next?.services?.languageUtils?.formatLanguageCode?.(language) ?? language;
    });

    return Array.from(new Set([...allowed, ...getLoadedLanguages(), selectedLanguage])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [revision, selectedLanguage, session]);
}

/** The languages i18next currently holds resources for. */
export function getLoadedLanguages(): Array<string> {
  return Object.keys(window.i18next?.store?.data ?? {});
}

/**
 * The namespaces the application has loaded that the language holds no resources for. A language
 * browsed earlier still lacks whatever the application loaded since.
 */
export function getMissingNamespaces(language: string): Array<string> {
  const loaded = new Set(getLoadedNamespaces(language));
  const running = new Set((window.i18next.languages ?? []).flatMap((candidate) => getLoadedNamespaces(candidate)));

  return Array.from(running).filter((namespace) => !loaded.has(namespace));
}

/**
 * Fetches, for a language the application is not running in, the namespaces the application has
 * loaded that it lacks, which is what lets an implementer browse and override a locale other than
 * their own.
 *
 * Not `loadLanguages`: it also requests i18next's default `translation` namespace, which the app
 * shell refuses, so it always reports a failure; and it adds the language to `preload`, so every
 * namespace the application loads afterwards is fetched in that language too.
 */
export async function loadTranslationLanguage(language: string): Promise<void> {
  await Promise.all(getMissingNamespaces(language).map((namespace) => loadTranslationNamespace(namespace, language)));
}

export function getLoadedNamespaces(language: string): Array<string> {
  return Object.keys(window.i18next?.store?.data?.[language] ?? {}).filter(
    (namespace) => !namespace.includes(extensionNamespaceSeparator),
  );
}

/**
 * The top-level string entries of a resource bundle.
 *
 * Nested entries are left out rather than flattened to `a.b`. An override is written at the literal
 * path it is given, and i18next resolves `a.b` by walking `a` then `b` before ever looking for a
 * flat key of that name, so a nested key could be listed and edited here but never actually
 * overridden — offering an action that silently does nothing is worse than not listing it. O3's
 * translation files are flat, so nothing is hidden in practice.
 */
export function flattenBundle(bundle: unknown): Record<string, string> {
  if (!bundle || typeof bundle !== 'object') {
    return {};
  }

  return Object.entries(bundle).reduce<Record<string, string>>((result, [key, value]) => {
    if (typeof value === 'string') {
      result[key] = value;
    }

    return result;
  }, {});
}

/**
 * Reports which config supplies an override for a key, or `undefined` if none does.
 *
 * The implementer tools config is a tree of `_value`/`_source` leaves. The config system builds
 * that tree by recursing through every provided config, so an override always appears as a leaf at
 * `[language][key]`, whether it came from a distribution's config file or from an edit made here.
 */
export function findOverrideSource(overrides: unknown, language: string, key: string): string | undefined {
  const languageNode = isRecord(overrides) ? overrides[language] : undefined;
  const leaf = isRecord(languageNode) ? languageNode[key] : undefined;
  const source = isRecord(leaf) && '_value' in leaf ? leaf._source : undefined;

  return typeof source === 'string' ? source : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

/**
 * The languages i18next would consult for the one being browsed, so a key it would resolve from a
 * fallback is listed with the value it would actually render. `i18next.languages` is not that: it is
 * the chain for whichever language the application is running in, so browsing `es` from a French app
 * would otherwise attribute French values to Spanish.
 */
function getResolutionHierarchy(language: string): Array<string> {
  const resolved = window.i18next?.services?.languageUtils?.toResolveHierarchy?.(language) ?? [];
  return Array.from(new Set([language, ...resolved]));
}

/**
 * Bumps a counter whenever i18next's resources change, giving the catalog a dependency it can
 * recompute on. i18next's resource store is not a zustand store, so it can't be read with
 * `useStore`.
 */
function useI18nextRevision(): number {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const store = window.i18next?.store;
    if (typeof store?.on !== 'function') {
      return;
    }

    const bump = () => setRevision((current) => current + 1);
    // Only `added`: nothing in this feature removes a bundle, so `removed` would never fire anyway.
    store.on('added', bump);

    return () => {
      store.off('added', bump);
    };
  }, []);

  return revision;
}
