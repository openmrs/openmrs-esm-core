[O3 Framework](../API.md) / getSynchronizationItems

# Function: ~~getSynchronizationItems()~~

> **getSynchronizationItems**\<`T`\>(`_type?`): `Promise`\<`T`[]\>

Defined in: [packages/framework/esm-framework/src/deprecated.ts:48](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/src/deprecated.ts#L48)

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
frontend modules that still read the sync queue keep working. It always resolves to an empty array,
since nothing is queued for synchronization any more.
