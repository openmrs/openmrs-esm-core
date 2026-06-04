import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { matchLocale } from './match-locale';

describe('matchLocale', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  describe('examples from the spec', () => {
    it('falls back to en-US when en-CA is requested but only other English variants exist', () => {
      expect(matchLocale('en-CA', ['en-US', 'en-GB', 'fr-FR'], 'en-US')).toBe('en-US');
    });

    it('matches the language family when the region differs', () => {
      expect(matchLocale('fr-BE', ['en-US', 'fr-FR', 'de-DE'], 'en-US')).toBe('fr-FR');
    });

    it('truncates a script subtag to find a script-only match', () => {
      expect(matchLocale('zh-Hant-TW', ['zh-Hant', 'zh-Hans', 'en'], 'en')).toBe('zh-Hant');
    });
  });

  describe('exact matching', () => {
    it('returns the exact match when one is present', () => {
      expect(matchLocale('en-US', ['fr-FR', 'en-US', 'de-DE'], 'fr-FR')).toBe('en-US');
    });

    it('returns the original casing from `available`, not the canonical form', () => {
      expect(matchLocale('en-us', ['en-US'])).toBe('en-US');
      expect(matchLocale('EN-US', ['en-us'])).toBe('en-us');
    });

    it('matches the first occurrence when an available locale appears multiple times', () => {
      expect(matchLocale('en', ['en', 'en-US', 'en'])).toBe('en');
    });
  });

  describe('canonicalization', () => {
    it('treats underscore-separated tags as equivalent to hyphen-separated tags', () => {
      expect(matchLocale('en_GB', ['en-GB'])).toBe('en-GB');
      expect(matchLocale('en-GB', ['en_GB'])).toBe('en_GB');
    });

    it('is case-insensitive across language, script, and region subtags', () => {
      expect(matchLocale('ZH-hant-tw', ['zh-Hant'])).toBe('zh-Hant');
    });

    it('canonicalizes script casing for matching (Latn vs latn)', () => {
      expect(matchLocale('sr-latn-rs', ['sr-Latn'])).toBe('sr-Latn');
    });
  });

  describe('truncation', () => {
    it('strips a region subtag to match a language-only available locale', () => {
      expect(matchLocale('en-CA', ['en'])).toBe('en');
    });

    it('strips a region from a script+region tag, leaving the script', () => {
      expect(matchLocale('zh-Hant-TW', ['zh-Hant'])).toBe('zh-Hant');
    });

    it('strips a single-letter extension singleton along with its trailing subtag', () => {
      // `en-US-x-private` → `en-US-x` → strip singleton → `en-US` → `en`.
      expect(matchLocale('en-US-x-private', ['en'])).toBe('en');
    });
  });

  describe('prefix expansion', () => {
    it('expands a language-only request to a regional variant', () => {
      expect(matchLocale('en', ['en-US', 'en-GB'])).toBe('en-US');
    });

    it('falls through truncation steps before expanding', () => {
      // `fr-BE` → no exact, no `fr-BE-…` prefix → truncate to `fr` →
      // no exact `fr` → expand to `fr-FR`.
      expect(matchLocale('fr-BE', ['fr-FR'])).toBe('fr-FR');
    });

    it('does not match across language families', () => {
      expect(matchLocale('fr-BE', ['en-US', 'de-DE'], 'en-US')).toBe('en-US');
    });
  });

  describe('fallback handling', () => {
    it('returns the fallback when no match is found', () => {
      expect(matchLocale('ja', ['en-US', 'fr-FR'], 'en-US')).toBe('en-US');
    });

    it('returns undefined when no fallback is provided and no match is found', () => {
      expect(matchLocale('ja', ['en-US', 'fr-FR'], undefined)).toBeUndefined();
    });

    it('returns the fallback when `available` is empty', () => {
      expect(matchLocale('en-US', [], 'fallback-tag')).toBe('fallback-tag');
    });

    it('returns the fallback when `requested` is null', () => {
      expect(matchLocale(null, ['en-US'], 'en-US')).toBe('en-US');
    });

    it('returns the fallback when `requested` is undefined', () => {
      expect(matchLocale(undefined, ['en-US'], 'en-US')).toBe('en-US');
    });
  });

  describe('ht → fr-HT fallback', () => {
    it('falls back to fr-HT when `ht` is requested and no Haitian Creole locale is available', () => {
      expect(matchLocale('ht', ['fr-HT', 'en-US'])).toBe('fr-HT');
    });

    it('falls back from `ht-HT` to `fr-HT`', () => {
      expect(matchLocale('ht-HT', ['fr-HT', 'en-US'])).toBe('fr-HT');
    });

    it('falls back from `ht-Latn-HT` to `fr-HT`', () => {
      expect(matchLocale('ht-Latn-HT', ['fr-HT', 'en-US'])).toBe('fr-HT');
    });

    it('continues truncating to plain `fr` when `fr-HT` is not available', () => {
      expect(matchLocale('ht', ['fr', 'en-US'])).toBe('fr');
    });

    it('expands the post-remap `fr-HT` candidate to any available `fr-*` variant', () => {
      // Truncate `ht` → remap to `fr-HT` → no exact `fr-HT` and no `fr-HT-…` →
      // truncate to `fr` → no exact `fr`, but prefix `fr-` matches `fr-FR`.
      expect(matchLocale('ht', ['fr-FR'])).toBe('fr-FR');
    });

    it('prefers an available `ht` locale over the French fallback', () => {
      expect(matchLocale('ht', ['ht', 'fr-HT'])).toBe('ht');
    });

    it('prefers an available `ht-HT` locale over the French fallback', () => {
      expect(matchLocale('ht-HT', ['ht-HT', 'fr-HT'])).toBe('ht-HT');
    });

    it('uses the `ht` prefix expansion before falling back to French', () => {
      // Requested `ht-Latn-HT` truncates to `ht`; prefix expansion finds `ht-HT`
      // before the loop ever sees the `ht` → `fr-HT` remap.
      expect(matchLocale('ht-Latn-HT', ['ht-HT', 'fr-HT'])).toBe('ht-HT');
    });

    it('returns the fallback when neither Haitian Creole nor French is available', () => {
      expect(matchLocale('ht-HT', ['en-US', 'de-DE'], 'en-US')).toBe('en-US');
    });
  });

  describe('invalid input', () => {
    it('returns the fallback and warns when `requested` is not a valid tag', () => {
      expect(matchLocale('not a locale', ['en-US'], 'en-US')).toBe('en-US');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid requested locale tag'));
    });

    it('returns the fallback and warns when `requested` is an empty string', () => {
      expect(matchLocale('', ['en-US'], 'en-US')).toBe('en-US');
      expect(warnSpy).toHaveBeenCalled();
    });

    it('skips invalid entries in `available` and warns about each', () => {
      expect(matchLocale('en-US', ['not-a-locale!', 'en-US'])).toBe('en-US');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('invalid available locale tag'));
    });

    it('still returns the fallback when every available entry is invalid', () => {
      expect(matchLocale('en-US', ['!!!', '@@@'], 'fallback')).toBe('fallback');
      expect(warnSpy).toHaveBeenCalledTimes(2);
    });

    it('does not warn when all inputs are valid', () => {
      matchLocale('en-US', ['en-US']);
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
