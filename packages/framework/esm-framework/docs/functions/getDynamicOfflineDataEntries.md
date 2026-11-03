[O3 Framework](../API.md) / getDynamicOfflineDataEntries

# Function: ~~getDynamicOfflineDataEntries()~~

> **getDynamicOfflineDataEntries**\<`T`\>(`_type?`): `Promise`\<`T`[]\>

Defined in: [packages/framework/esm-framework/src/deprecated.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/src/deprecated.ts#L39)

## Type Parameters

### T

`T` = `unknown`

## Parameters

### \_type?

`string`

## Returns

`Promise`\<`T`[]\>

## Deprecated

Offline support has been removed from the framework. This is a stub kept only so that
frontend modules that still read the dynamic offline data registry keep working. It always resolves
to an empty array, since nothing is registered for offline use any more.
