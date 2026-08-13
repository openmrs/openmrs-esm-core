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
  ])('renders %s as %s', (locale, expected) => {
    expect(getLocaleDisplayName(locale)).toBe(expected);
  });

  it('resolves a POSIX script modifier to a name rather than the raw identifier', () => {
    // Asserted loosely on purpose. The script name is engine-specific: Node renders `uz@Latn` as
    // "o‘zbek (lotin)" and Chrome as "O‘zbek (Latn)", so pinning either would assert a string half
    // the runtimes never produce. `toLanguageTag` covers the conversion itself exactly.
    const name = getLocaleDisplayName('uz@Latn');

    expect(name).not.toBe('uz@Latn');
    expect(name.toLowerCase()).toContain('zbek');
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
