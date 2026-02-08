[O3 Framework](../API.md) / usePrimaryIdentifierCode

# Function: usePrimaryIdentifierCode()

> **usePrimaryIdentifierCode**(): `object`

Defined in: [packages/framework/esm-react-utils/src/usePrimaryIdentifierResource.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePrimaryIdentifierResource.ts#L21)

A React hook that retrieves the UUID of the primary patient identifier type
from the metadata mapping configuration. This identifier type is commonly used
to display the main identifier for a patient, such as their medical record number.

## Returns

`object`

An object containing the primary identifier type UUID, loading state, and any error.

### error

> **error**: `undefined` \| `Error`

### isLoading

> **isLoading**: `boolean`

### primaryIdentifierCode

> **primaryIdentifierCode**: `undefined` \| `string`
