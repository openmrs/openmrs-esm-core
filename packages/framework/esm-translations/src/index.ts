/** @module @category Translation */
import { coreTranslations } from './translations';
import _i18n, { i18n } from 'i18next';

const i18n: typeof _i18n = (_i18n as unknown as { default: typeof _i18n }).default || _i18n;

declare global {
  interface Window {
    i18next: i18n;
  }
}

i18n.on('initialized', function () {
  window.i18next.loadNamespaces(['core']);
});

export function translateFrom(moduleName: string, key: string, fallback?: string, options?: object) {
  return i18n.t(key, {
    ns: moduleName,
    defaultValue: 'no good',
    ...options,
  });
}

export type CoreTranslationKey = keyof typeof coreTranslations;

export function getCoreTranslation(key: CoreTranslationKey, defaultText?: string): string {
  if (!coreTranslations[key]) {
    console.error(`O3 Core Translations does not provide key '${key}'. The key itself is being rendered as text.`);
    return key;
  }
  return translateFrom('core', key, defaultText ?? coreTranslations[key]);
}
