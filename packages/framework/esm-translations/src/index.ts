/** @module @category Translation */
import _i18n from 'i18next';
import { coreTranslations } from './translations';

export const importCoreTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {}

export type CoreTranslationKey = keyof typeof coreTranslations;

export function translateFrom(moduleName: string, key: string, fallback?: string, options?: object) {
  const i18n: typeof _i18n = (_i18n as unknown as { default: typeof _i18n }).default || _i18n;

  return i18n.t(key, {
    ns: moduleName,
    defaultValue: fallback,
    ...options,
  });
}

export function getCoreTranslation(key: CoreTranslationKey, defaultText?: string): string {
  if (!coreTranslations[key]) {
    console.error(`O3 Core Translations does not provide key '${key}'. The key itself is being rendered as text.`);
    return key;
  }
  return translateFrom('core', key, defaultText ?? coreTranslations[key]);
}
