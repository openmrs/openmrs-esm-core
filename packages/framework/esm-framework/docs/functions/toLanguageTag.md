[O3 Framework](../API.md) / toLanguageTag

# Function: toLanguageTag()

> **toLanguageTag**(`locale`): `undefined` \| `string`

Defined in: [packages/framework/esm-utils/src/language-tag.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/language-tag.ts#L25)

Converts an OpenMRS locale identifier into a canonical BCP 47 language tag.

OpenMRS locale identifiers are not always language tags. User properties such as
`defaultLocale` store Java's `Locale#toString()` form (`en_US`, `sw_KE`) verbatim, some backends
serialize session locales the same way, and some installs configure POSIX-style variants
(`uz@Latn`). The `Intl` constructors throw `RangeError` rather than degrading when handed any of
them, so convert before passing an OpenMRS locale to `Intl`.

Both `_` and `@` are treated as subtag separators, which covers the `@Latn` script modifier.
Other POSIX modifiers have no BCP 47 equivalent and parse as whatever their length implies
(`de@euro` becomes the script subtag `de-Euro`), so they are converted rather than rejected.

## Parameters

### locale

An OpenMRS locale identifier, e.g. `sw_KE`. Locale data reaching this function
  comes from the REST session and from configuration, so anything that is not a string is
  treated as an unresolvable locale rather than an error.

`undefined` | `null` | `string`

## Returns

`undefined` \| `string`

The canonical language tag, or `undefined` if `locale` is not a structurally valid tag.

## Example

```ts
toLanguageTag('sw_KE'); // => 'sw-KE'
toLanguageTag('uz@Latn'); // => 'uz-Latn'
toLanguageTag('en_us'); // => 'en-US'
toLanguageTag('not a locale'); // => undefined
```
