[O3 Framework](../API.md) / matchLocale

# Function: matchLocale()

> **matchLocale**(`requested`, `available`, `fallback?`): `undefined` \| `string`

Defined in: [packages/framework/esm-utils/src/match-locale.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/match-locale.ts#L53)

Resolves a requested locale against a list of available locales using the
BCP 47 lookup algorithm (RFC 4647, §3.4).

Tags are compared in canonical form via Intl.Locale, so casing and
underscore-vs-hyphen differences in the inputs do not affect matching. The
value returned is taken verbatim from `available`, preserving the caller's
original casing.

In addition to the truncation steps prescribed by RFC 4647, this function
also performs prefix expansion at each level: when the requested tag is
truncated to a more general range (e.g. `en` after stripping `en-CA`), any
available locale whose canonical form begins with that range plus a hyphen
(e.g. `en-US`, `en-GB`) is treated as a match. This is a relaxation of the
strict lookup algorithm but typically reflects user intent — a user who
asked for `en-CA` will usually accept `en-US` over a non-English fallback.

Tags that fail to parse are skipped with a console warning; they never match
and never throw.

## Parameters

### requested

The locale the caller would like to use, or `null`/`undefined`
  if no preference is known.

`undefined` | `null` | `string`

### available

readonly `string`[]

The list of locales the application supports.

### fallback?

`string`

The value to return when no match is found. Defaults to
  `undefined`.

## Returns

`undefined` \| `string`

The matched locale from `available`, or `fallback` if nothing matches.

## Example

```ts
matchLocale('en-CA', ['en-US', 'en-GB', 'fr-FR'], 'en-US'); // => 'en-US'
matchLocale('fr-BE', ['en-US', 'fr-FR', 'de-DE'], 'en-US'); // => 'fr-FR'
matchLocale('zh-Hant-TW', ['zh-Hant', 'zh-Hans', 'en'], 'en'); // => 'zh-Hant'
```
