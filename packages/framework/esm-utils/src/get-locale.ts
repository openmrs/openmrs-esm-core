/**
 * Returns the current locale of the application.
 * @returns string
 */
export function getLocale() {
  let language = window.i18next.language;
  language = language.replace('_', '-'); // just in case
  // Hack for `ht` until all browsers update their unicode support with ht to fr mapping.
  // See https://unicode-org.atlassian.net/browse/CLDR-14956
  if (language === 'ht') {
    language = 'fr-HT';
  }
  return language;
}
