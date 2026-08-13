[O3 Framework](../API.md) / toLanguageTag

# Function: toLanguageTag()

> **toLanguageTag**(`locale`): `undefined` \| `string`

Defined in: [packages/framework/esm-utils/src/language-tag.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/language-tag.ts#L24)

Converts an OpenMRS locale identifier into a canonical BCP 47 language tag.

The REST API reports locales in Java's `Locale#toString()` form (`en_US`, `sw_KE`), and some
installs configure POSIX-style variants (`uz@Latn`). Neither is a valid language tag, and the
`Intl` constructors throw `RangeError` rather than degrading, so convert before handing an
OpenMRS locale to `Intl`.

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
