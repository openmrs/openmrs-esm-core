[O3 Framework](../API.md) / getSynchronizationItem

# Function: getSynchronizationItem()

> **getSynchronizationItem**\<`T`\>(`id`): `Promise`\<`undefined` \| [`SyncItem`](../interfaces/SyncItem.md)\<`T`\>\>

Defined in: [packages/framework/esm-offline/src/sync.ts:311](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L311)

Returns a queued sync item with the given ID or `undefined` if no such item exists.

## Type Parameters

### T

`T` = `any`

## Parameters

### id

`number`

The ID of the requested sync item.

## Returns

`Promise`\<`undefined` \| [`SyncItem`](../interfaces/SyncItem.md)\<`T`\>\>
