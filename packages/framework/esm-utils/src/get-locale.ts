/**
 * Returns the current locale of the application.
 * @returns string
 */
export function getLocale() {
  let language = window.i18next.language;
  language = language.replace('_', '-'); // just in case
  return language;
}
