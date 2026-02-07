/** @module @category Translation */
import { coreTranslations } from './translations';
import _i18n, { i18n, type TOptions } from 'i18next';

const i18n: typeof _i18n = (_i18n as unknown as { default: typeof _i18n }).default || _i18n;

declare global {
  interface Window {
    i18next: i18n;
  }
}

i18n.on('initialized', function () {
  window.i18next.loadNamespaces(['core']);
});

/**
 * This function is for getting a translation from a specific module. Use this only if the
 * translation is neither in the app making the call, nor in the core translations.
 * This function is useful, for example, in libraries that are used by multiple apps, since libraries can't
 * define their own translations.
 *
 * Translations within the current app should be accessed with the i18next API, using
 * `useTranslation` and `t` as usual. Core translations should be accessed with the
 * [[getCoreTranslation]] function.
 *
 * IMPORTANT: This function creates a hidden dependency on the module. Worse yet, it creates
 * a dependency specifically on that module's translation keys, which are often regarded as
 * "implementation details" and therefore may be volatile. Also note that this function DOES NOT
 * load the module's translations if they have not already been loaded via `useTranslation`.
 * **This function should therefore be avoided when possible.**
 *
 * @param moduleName The module to get the translation from, e.g. '@openmrs/esm-login-app'
 * @param key The i18next translation key
 * @param fallback Fallback text for if the lookup fails
 * @param options Options object passed to the i18next `t` function. See https://www.i18next.com/translation-function/essentials#overview-options
 *            for more information. `ns` and `defaultValue` are already set and may not be used.
 * @returns The translated text as a string
 */
export function translateFrom(
  moduleName: string,
  key: string,
  fallback?: string,
  options?: Omit<TOptions, 'ns' | 'defaultValue'>,
) {
  return i18n.t(key, {
    ns: moduleName,
    defaultValue: fallback,
    ...options,
  });
}

export type CoreTranslationKey = keyof typeof coreTranslations;

/**
 * Use this function to obtain a translation from the core translations. This is a way to avoid having
 * to define common translations in your app, and to ensure that translations are consistent across
 * different apps. This function is also used to obtain translations in the framework and app shell.
 *
 * The complete set of core translations is available on the `CoreTranslationKey` type. Providing an
 * invalid key to this function will result in a type error.
 *
 * @param key The translation key from the set of core translations.
 * @param defaultText Optional fallback text if the translation is not found.
 * @param options Object passed to the i18next `t` function. See https://www.i18next.com/translation-function/essentials#overview-options
 *           for more information. `ns` and `defaultValue` are already set and may not be used.
 * @returns The translated string.
 */
export function getCoreTranslation(
  key: CoreTranslationKey,
  defaultText?: string,
  options?: Omit<TOptions, 'ns' | 'defaultValue'>,
): string {
  if (!coreTranslations[key]) {
    console.error(`O3 Core Translations does not provide key '${key}'. The key itself is being rendered as text.`);
    return key;
  }
  return translateFrom('core', key, defaultText ?? coreTranslations[key], options);
}


/**
 * Creates a translateWithId function for Carbon Design System components that require
 * translation of their internal strings. This is particularly useful for components like
 * TableBatchActions, Pagination, Dropdown, etc. that use the translateWithId prop.
 *
 * Carbon components call translateWithId with:
 * - id: A string identifier (e.g., 'carbon.table.batch.items.selected')
 * - state: An optional object with interpolation values (e.g., { totalSelected: 5 })
 *
 * @param translationMap Optional mapping of Carbon translation IDs to custom CoreTranslationKeys.
 *                       If not provided, uses the Carbon IDs directly as CoreTranslationKeys.
 * @returns A function compatible with Carbon's translateWithId prop
 *
 */
export function getCarbonTranslateWithId(
  translationMap?: Record<string, CoreTranslationKey>,
): (id: string, state?: Record<string, any>) => string {
  return (id: string, state?: Record<string, any>) => {
    const key = translationMap?.[id] ?? id;

    if (key in coreTranslations) {
      return getCoreTranslation(key as CoreTranslationKey, undefined, state);
    }
    console.warn(
      `Carbon translation key '${id}' not found in core translations. Using the key as fallback.`,
    );
    return id;
  };
}
