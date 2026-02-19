// Storybook-compatible mock for @openmrs/esm-translations.
// Uses the real English translation strings so components render realistic text.
import { coreTranslations } from '@openmrs/esm-translations/src/translations';

function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params) {
    return template;
  }
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(value)),
    template,
  );
}

export type CoreTranslationKey = keyof typeof coreTranslations;

export function getCoreTranslation(key: string, defaultText?: string, options?: Record<string, unknown>): string {
  const template = (coreTranslations as Record<string, string>)[key] ?? defaultText ?? key;
  return interpolate(template, options);
}

export function translateFrom(
  _moduleName: string,
  key: string,
  fallback?: string,
  options?: Record<string, unknown>,
): string {
  return interpolate(fallback ?? key, options);
}
