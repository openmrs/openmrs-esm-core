import { coreTranslations } from './src/translations';

export const enableTranslationInspector = jest.fn();
export const disableTranslationInspector = jest.fn();
export const isTranslationInspectorRecording = jest.fn(() => false);
export const recordTranslationSighting = jest.fn();
export const matchTranslations = jest.fn(() => []);
export const extensionNamespaceSeparator = '___';

export const getCoreTranslation = jest.fn(
  (key: string, defaultText?: string, options?: Record<string | number | symbol, unknown>) =>
    interpolate(coreTranslations[key] ?? defaultText, options),
);

export const translateFrom = jest.fn(
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
