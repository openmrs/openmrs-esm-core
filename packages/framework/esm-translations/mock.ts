import { vi } from 'vitest';
import { coreTranslations } from './src/translations';

export const getCoreTranslation = vi.fn(
  (key: string, defaultText?: string, options?: Record<string | number | symbol, unknown>) =>
    interpolate(coreTranslations[key] ?? defaultText, options),
);

export const translateFrom = vi.fn(
  (moduleName: string, key: string, fallback?: string, options?: Record<string | number | symbol, unknown>) => {
    if (moduleName === 'core') {
      return interpolate(coreTranslations[key] ?? fallback, options);
    } else {
      return interpolate(key ?? fallback, options);
    }
  },
);

function interpolate(stringValue: string, options?: Record<string | number | symbol, unknown>) {
  if (options) {
    Object.keys(options).forEach((key) => {
      stringValue = stringValue.replace(`{{${key}}}`, '' + options[key]);
    });
  }
  return stringValue;
}
