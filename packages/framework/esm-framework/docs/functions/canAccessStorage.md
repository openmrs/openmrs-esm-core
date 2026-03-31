[O3 Framework](../API.md) / canAccessStorage

# Function: canAccessStorage()

> **canAccessStorage**(`storage`): `boolean`

Defined in: [packages/framework/esm-utils/src/storage.ts:11](https://github.com/DushmanthaHerath1/openmrs-esm-core/blob/main/packages/framework/esm-utils/src/storage.ts#L11)

Simple utility function to determine if an object implementing the WebStorage API
is actually available. Useful for testing the availability of `localStorage` or
`sessionStorage`.

## Parameters

### storage

`Storage` = `window.localStorage`

The WebStorage API object to check. Defaults to `localStorage`.

## Returns

`boolean`

True if the WebStorage API object is able to be accessed, false otherwise
