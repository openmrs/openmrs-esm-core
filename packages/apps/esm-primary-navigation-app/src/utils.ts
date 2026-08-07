import type { LayoutType } from '@openmrs/esm-framework';

export const isDesktop = (layout: LayoutType) => layout === 'small-desktop' || layout === 'large-desktop';

/**
 * Converts an OpenMRS locale identifier into a BCP 47 language tag.
 *
 * The REST API reports locales in Java's `Locale#toString()` form (`en_US`, `sw_KE`), and some
 * configurations use POSIX-style variants (`uz@Latn`). Neither is a valid language tag, and the
 * `Intl` constructors throw `RangeError` rather than degrading, so always convert before handing
 * a locale to `Intl`.
 */
export function toLanguageTag(locale: string) {
  return locale.replace(/[_@]/g, '-');
}

/**
 * Returns the name of `locale` as written in that locale (`fr` becomes "français"), falling back
 * to the identifier itself for locales `Intl` cannot resolve.
 */
export function getLocaleDisplayName(locale: string) {
  try {
    const languageTag = toLanguageTag(locale);
    return new Intl.DisplayNames([languageTag], { type: 'language' }).of(languageTag) ?? locale;
  } catch {
    // Covers both a tag Intl rejects and a `locale` that is not a string at all; a helper whose
    // job is keeping bad locale data from crashing the UI must not itself throw on it.
    return locale;
  }
}
