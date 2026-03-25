[O3 Framework](../API.md) / makeUrl

# Function: makeUrl()

> **makeUrl**(`path`): `string`

Defined in: [packages/framework/esm-api/src/openmrs-fetch.ts:30](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch.ts#L30)

Append `path` to the OpenMRS SPA base.

## Parameters

### path

`string`

The path to append to the OpenMRS base URL.

## Returns

`string`

The full URL with the OpenMRS base prepended. If the path is already
  an absolute URL (starting with 'http'), it is returned unchanged.

## Example

```ts
makeUrl('/foo/bar');
// => '/openmrs/foo/bar'
```
