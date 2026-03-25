[O3 Framework](../API.md) / getDynamicOfflineDataEntries

# Function: getDynamicOfflineDataEntries()

> **getDynamicOfflineDataEntries**\<`T`\>(`type?`): `Promise`\<`T`[]\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L128)

Returns all [DynamicOfflineData](../interfaces/DynamicOfflineData.md) entries which registered for the currently logged in user.
Optionally returns only entries of a given type.

## Type Parameters

### T

`T` *extends* [`DynamicOfflineData`](../interfaces/DynamicOfflineData.md)

## Parameters

### type?

`string`

The type of the entries to be returned. If `undefined`, returns all types.

## Returns

`Promise`\<`T`[]\>
