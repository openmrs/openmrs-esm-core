import { coreTranslations } from './src/translations';

export const getCoreTranslation = jest.fn((key: string, defaultText?: string) => coreTranslations[key] ?? defaultText);
export const translateFrom = jest.fn((moduleName: string, key: string, fallback?: string, options?: object) => {
  if (moduleName === 'core') {
    return coreTranslations[key] ?? fallback;
  } else {
    return key ?? fallback;
  }
});
