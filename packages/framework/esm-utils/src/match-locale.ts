/**
 * Returns a canonical BCP 47 representation of `tag`, or `undefined` if it is not a
 * structurally valid tag. Underscores are accepted as a separator and normalized to
 * hyphens before canonicalization to accommodate locale strings that originate from
 * Java-style identifiers (e.g. `en_GB`).
 */
function canonicalize(tag: string): string | undefined {
  if (typeof tag !== 'string' || tag.trim().length === 0) {
    return undefined;
  }

  const normalized = tag.replaceAll('_', '-');

  try {
    return new Intl.Locale(normalized).toString();
  } catch {
    return undefined;
  }
}

/**
 * Resolves a requested locale against a list of available locales using the
 * BCP 47 lookup algorithm (RFC 4647, §3.4).
 *
 * Tags are compared in canonical form via {@link Intl.Locale}, so casing and
 * underscore-vs-hyphen differences in the inputs do not affect matching. The
 * value returned is taken verbatim from `available`, preserving the caller's
 * original casing.
 *
 * In addition to the truncation steps prescribed by RFC 4647, this function
 * also performs prefix expansion at each level: when the requested tag is
 * truncated to a more general range (e.g. `en` after stripping `en-CA`), any
 * available locale whose canonical form begins with that range plus a hyphen
 * (e.g. `en-US`, `en-GB`) is treated as a match. This is a relaxation of the
 * strict lookup algorithm but typically reflects user intent — a user who
 * asked for `en-CA` will usually accept `en-US` over a non-English fallback.
 *
 * Tags that fail to parse are skipped with a console warning; they never match
 * and never throw.
 *
 * @param requested - The locale the caller would like to use, or `null`/`undefined`
 *   if no preference is known.
 * @param available - The list of locales the application supports.
 * @param fallback - The value to return when no match is found. Defaults to
 *   `undefined`.
 * @returns The matched locale from `available`, or `fallback` if nothing matches.
 *
 * @example
 * matchLocale('en-CA', ['en-US', 'en-GB', 'fr-FR'], 'en-US'); // => 'en-US'
 * matchLocale('fr-BE', ['en-US', 'fr-FR', 'de-DE'], 'en-US'); // => 'fr-FR'
 * matchLocale('zh-Hant-TW', ['zh-Hant', 'zh-Hans', 'en'], 'en'); // => 'zh-Hant'
 */
export function matchLocale(
  requested: string | null | undefined,
  available: ReadonlyArray<string>,
  fallback?: string,
): string | undefined {
  if (requested == null) {
    return fallback;
  }

  const requestedCanonical = canonicalize(requested);
  if (!requestedCanonical) {
    console.warn(`matchLocale: invalid requested locale tag: ${JSON.stringify(requested)}`);
    return fallback;
  }

  const pool: Array<{ canonical: string; original: string }> = [];
  for (const entry of available) {
    const canonical = canonicalize(entry);
    if (!canonical) {
      console.warn(`matchLocale: skipping invalid available locale tag: ${JSON.stringify(entry)}`);
      continue;
    }
    pool.push({ canonical, original: entry });
  }

  let candidate = requestedCanonical;
  while (candidate) {
    const exact = pool.find((p) => p.canonical === candidate);
    if (exact) {
      return exact.original;
    }

    const prefix = candidate + '-';
    const prefixed = pool.find((p) => p.canonical.startsWith(prefix));
    if (prefixed) {
      return prefixed.original;
    }

    // Once the truncation chain has exhausted every `ht` option, retry the
    // lookup with `fr-HT`. This mirrors the `ht` → `fr-HT` workaround in
    // `get-locale.ts`: Haitian Creole content is typically registered under
    // `fr-HT` because of incomplete browser Intl support for `ht`, so a caller
    // asking for `ht` needs to find it there.
    if (candidate === 'ht') {
      candidate = 'fr-HT';
      continue;
    }

    // RFC 4647 §3.4 step 4: strip the trailing subtag.
    const lastDash = candidate.lastIndexOf('-');
    if (lastDash === -1) {
      break;
    }
    candidate = candidate.slice(0, lastDash);

    // RFC 4647 §3.4 step 5: a trailing single-letter subtag is an extension
    // singleton (e.g. `-x-` for private use, `-u-` for Unicode extensions) and
    // is not meaningful on its own, so strip it together with its separator.
    const tailDash = candidate.lastIndexOf('-');
    if (tailDash !== -1 && candidate.length - tailDash === 2) {
      candidate = candidate.slice(0, tailDash);
    }
  }

  return fallback;
}
