import { describe, expect, it } from 'vitest';
import { getLocaleDisplayName, toLanguageTag } from './language-tag';

describe('toLanguageTag', () => {
  it.each([
    ['en', 'en'],
    // The REST session reports Java `Locale#toString()` values, which are not language tags.
    ['en_US', 'en-US'],
    ['sw_KE', 'sw-KE'],
    ['uz@Latn', 'uz-Latn'],
    // Canonicalization also fixes subtag casing.
    ['en_us', 'en-US'],
    ['ZH-hant-tw', 'zh-Hant-TW'],
  ])('converts %s to %s', (locale, expected) => {
    expect(toLanguageTag(locale)).toBe(expected);
  });

  it.each([['not a locale'], ['!!!'], ['']])('returns undefined for %j', (locale) => {
    expect(toLanguageTag(locale)).toBeUndefined();
  });

  it('returns undefined for a missing locale rather than throwing', () => {
    // Locale data reaching this function comes from the REST session and from configuration,
    // neither of which is guaranteed to be well formed at runtime.
    expect(toLanguageTag(null)).toBeUndefined();
    expect(toLanguageTag(undefined)).toBeUndefined();
  });
});

describe('getLocaleDisplayName', () => {
  it.each([
    ['en', 'English'],
    ['fr', 'français'],
    ['en_US', 'American English'],
    ['sw_KE', 'Kiswahili (Kenya)'],
    ['pt_BR', 'português (Brasil)'],
    ['uz@Latn', 'o‘zbek (lotin)'],
  ])('renders %s as %s', (locale, expected) => {
    expect(getLocaleDisplayName(locale)).toBe(expected);
  });

  it('falls back to the identifier when the locale is not a valid tag', () => {
    expect(getLocaleDisplayName('not a locale at all')).toBe('not a locale at all');
  });

  it('falls back to the identifier for a tag `Intl.DisplayNames` rejects', () => {
    // `Intl.Locale` accepts extension subtags but `Intl.DisplayNames#of` throws on them.
    expect(getLocaleDisplayName('en-u-ca-gregory')).toBe('en-u-ca-gregory');
  });

  it('returns an empty string when no locale is given', () => {
    expect(getLocaleDisplayName(null)).toBe('');
    expect(getLocaleDisplayName(undefined)).toBe('');
  });
});
