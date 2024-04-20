import { coreTranslations } from './src/translations';

export const getCoreTranslation = jest.fn((key: string, defaultText?: string, options?: object) =>
  interpolate(coreTranslations[key] ?? defaultText, options),
);
export const translateFrom = jest.fn((moduleName: string, key: string, fallback?: string, options?: object) => {
  if (moduleName === 'core') {
    return interpolate(coreTranslations[key] ?? fallback, options);
  } else {
    return interpolate(key ?? fallback, options);
  }
});

function interpolate(stringValue, options) {
  if (options) {
    Object.keys(options).forEach((key) => {
      stringValue = stringValue.replace(`{{${key}}}`, options[key]);
    });
  }
  return stringValue;
}
