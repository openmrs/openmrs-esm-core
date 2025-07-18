[O3 Framework](../API.md) / getDynamicOfflineDataEntriesFor

# Function: getDynamicOfflineDataEntriesFor()

> **getDynamicOfflineDataEntriesFor**\<`T`\>(`userId`, `type?`): `Promise`\<`T`[]\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:139](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L139)

Returns all [DynamicOfflineData](../interfaces/DynamicOfflineData.md) entries which registered for the given user.
Optionally returns only entries of a given type.

## Type Parameters

### T

`T` *extends* [`DynamicOfflineData`](../interfaces/DynamicOfflineData.md)

## Parameters

### userId

`string`

The ID of the user whose entries are to be retrieved.

### type?

`string`

The type of the entries to be returned. If `undefined`, returns all types.

## Returns

`Promise`\<`T`[]\>
