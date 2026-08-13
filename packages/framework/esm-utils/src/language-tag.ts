/**
 * Converts an OpenMRS locale identifier into a canonical BCP 47 language tag.
 *
 * OpenMRS locale identifiers are not always language tags. User properties such as
 * `defaultLocale` store Java's `Locale#toString()` form (`en_US`, `sw_KE`) verbatim, some backends
 * serialize session locales the same way, and some installs configure POSIX-style variants
 * (`uz@Latn`). The `Intl` constructors throw `RangeError` rather than degrading when handed any of
 * them, so convert before passing an OpenMRS locale to `Intl`.
 *
 * Both `_` and `@` are treated as subtag separators, which covers the `@Latn` script modifier.
 * Other POSIX modifiers have no BCP 47 equivalent and parse as whatever their length implies
 * (`de@euro` becomes the script subtag `de-Euro`), so they are converted rather than rejected.
 *
 * @param locale An OpenMRS locale identifier, e.g. `sw_KE`. Locale data reaching this function
 *   comes from the REST session and from configuration, so anything that is not a string is
 *   treated as an unresolvable locale rather than an error.
 * @returns The canonical language tag, or `undefined` if `locale` is not a structurally valid tag.
 *
 * @example
 * toLanguageTag('sw_KE'); // => 'sw-KE'
 * toLanguageTag('uz@Latn'); // => 'uz-Latn'
 * toLanguageTag('en_us'); // => 'en-US'
 * toLanguageTag('not a locale'); // => undefined
 */
export function toLanguageTag(locale: string | null | undefined): string | undefined {
  if (typeof locale !== 'string' || locale.trim().length === 0) {
    return undefined;
  }

  try {
    return new Intl.Locale(locale.replace(/[_@]/g, '-')).toString();
  } catch {
    return undefined;
  }
}

/**
 * Returns the name of a locale as written in that locale, so `fr` becomes "français" and `sw_KE`
 * becomes "Kiswahili (Kenya)". Falls back to the identifier itself for anything `Intl` cannot
 * resolve, so the result is always safe to render.
 *
 * The name is CLDR's middle-of-sentence form. When presenting it as a standalone label, capitalize
 * only the first character: lowercasing the remainder corrupts names carrying internal capitals,
 * turning "American English" into "American english".
 *
 * @param locale An OpenMRS locale identifier, e.g. `sw_KE`.
 * @returns The locale's name in its own language, `locale` itself if it cannot be resolved, or an
 *   empty string if no locale was given.
 *
 * @example
 * getLocaleDisplayName('fr'); // => 'français'
 * getLocaleDisplayName('sw_KE'); // => 'Kiswahili (Kenya)'
 */
export function getLocaleDisplayName(locale: string | null | undefined): string {
  const identifier = locale ?? '';
  const languageTag = toLanguageTag(identifier);

  if (!languageTag) {
    return identifier;
  }

  try {
    return new Intl.DisplayNames([languageTag], { type: 'language' }).of(languageTag) ?? identifier;
  } catch {
    // `Intl.DisplayNames` validates independently of `Intl.Locale` and rejects tags carrying
    // extension or private-use subtags, such as `en-u-ca-gregory`.
    return identifier;
  }
}
