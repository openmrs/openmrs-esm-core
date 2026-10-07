import { vi } from 'vitest';
import { coreTranslations } from './src/translations';

function resolveTranslation(key: string, fallback?: string, options?: Record<string | number | symbol, unknown>) {
  if (options && typeof options.count === 'number') {
    const suffix = options.count === 1 ? '_one' : '_other';
    const suffixedKey = `${key}${suffix}`;
    if (suffixedKey in coreTranslations) {
      return (coreTranslations as Record<string, string>)[suffixedKey];
    }
  }
  return (coreTranslations as Record<string, string>)[key] ?? fallback;
}

export const getCoreTranslation = vi.fn(
  (key: string, defaultText?: string, options?: Record<string | number | symbol, unknown>) =>
    interpolate(resolveTranslation(key, defaultText, options), options),
);

export const translateFrom = vi.fn(
  (moduleName: string, key: string, fallback?: string, options?: Record<string | number | symbol, unknown>) => {
    if (moduleName === 'core') {
      return interpolate(resolveTranslation(key, fallback, options), options);
    } else {
      return interpolate(key ?? fallback, options);
    }
  },
);

function interpolate(stringValue?: string, options?: Record<string | number | symbol, unknown>) {
  if (!stringValue) {
    return '';
  }
  if (options) {
    Object.keys(options).forEach((key) => {
      stringValue = stringValue!.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), '' + options[key]);
    });
  }
  return stringValue;
}
