/** Loads the framework's own translation file for a locale, named as in `pt_BR`. */
export function importCoreTranslation(fileLocale: string): Promise<{ default?: Record<string, string> }> {
  return import(/* webpackMode: "lazy" */ `@openmrs/esm-translations/translations/${fileLocale}.json`);
}
