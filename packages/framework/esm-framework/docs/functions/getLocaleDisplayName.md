[O3 Framework](../API.md) / getLocaleDisplayName

# Function: getLocaleDisplayName()

> **getLocaleDisplayName**(`locale`): `string`

Defined in: [packages/framework/esm-utils/src/language-tag.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/language-tag.ts#L53)

Returns the name of a locale as written in that locale, so `fr` becomes "français" and `sw_KE`
becomes "Kiswahili (Kenya)". Falls back to the identifier itself for anything `Intl` cannot
resolve, so the result is always safe to render.

The name is CLDR's middle-of-sentence form. When presenting it as a standalone label, capitalize
it with `upperFirst`: `capitalize` lowercases the rest of the string, which turns "American
English" into "American english".

## Parameters

### locale

An OpenMRS locale identifier, e.g. `sw_KE`.

`undefined` | `null` | `string`

## Returns

`string`

The locale's name in its own language, `locale` itself if it cannot be resolved, or an
  empty string if no locale was given.

## Example

```ts
getLocaleDisplayName('fr'); // => 'français'
getLocaleDisplayName('sw_KE'); // => 'Kiswahili (Kenya)'
```
