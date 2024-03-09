import { coreTranslations } from './src/translations';

export const getCoreTranslation = jest.fn((key: string, defaultText?: string) => coreTranslations[key]);
export const translateFrom = jest.fn((moduleName: string, key: string, fallback?: string, options?: object) => {
  if (moduleName === 'core') {
    return coreTranslations[key];
  } else {
    return key;
  }
});
