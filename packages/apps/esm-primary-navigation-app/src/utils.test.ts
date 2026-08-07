import { describe, expect, it } from 'vitest';
import { getLocaleDisplayName, toLanguageTag } from './utils';

describe('toLanguageTag', () => {
  it.each([
    ['en', 'en'],
    ['en_US', 'en-US'],
    ['sw_KE', 'sw-KE'],
    ['uz@Latn', 'uz-Latn'],
  ])('converts %s to %s', (locale, expected) => {
    expect(toLanguageTag(locale)).toBe(expected);
  });
});

describe('getLocaleDisplayName', () => {
  it.each([
    ['en', 'English'],
    ['fr', 'français'],
    // The REST session reports Java `Locale#toString()` values, which are not language tags.
    ['en_US', 'American English'],
    ['sw_KE', 'Kiswahili (Kenya)'],
    ['pt_BR', 'português (Brasil)'],
    ['uz@Latn', 'o‘zbek (lotin)'],
  ])('renders %s as %s', (locale, expected) => {
    expect(getLocaleDisplayName(locale)).toBe(expected);
  });

  it('falls back to the raw identifier when Intl cannot resolve the locale', () => {
    expect(getLocaleDisplayName('not a locale at all')).toBe('not a locale at all');
  });

  it('returns non-string input unchanged rather than throwing', () => {
    // The session type says string, but this helper exists to absorb bad locale data.
    expect(getLocaleDisplayName(null as unknown as string)).toBeNull();
    expect(getLocaleDisplayName(undefined as unknown as string)).toBeUndefined();
  });
});
