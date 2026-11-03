import { toLanguageTag } from './language-tag';

/**
 * Returns the current locale of the application.
 * @returns string
 */
export function getLocale() {
  // i18next detects the language from the `lang` attribute, a `?lang=` parameter, localStorage or
  // the browser, none of which is guaranteed to be a BCP 47 tag, so normalize before returning.
  const detected = window.i18next.language;
  let language = toLanguageTag(detected) ?? detected;
  // Hack for `ht` until all browsers update their unicode support with ht to fr mapping.
  // See https://unicode-org.atlassian.net/browse/CLDR-14956
  if (language === 'ht') {
    language = 'fr-HT';
  }
  return language;
}
