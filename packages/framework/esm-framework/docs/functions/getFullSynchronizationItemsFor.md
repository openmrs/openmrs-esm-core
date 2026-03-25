[O3 Framework](../API.md) / getFullSynchronizationItemsFor

# Function: getFullSynchronizationItemsFor()

> **getFullSynchronizationItemsFor**\<`T`\>(`userId`, `type?`): `Promise`\<[`SyncItem`](../interfaces/SyncItem.md)\<`T`\>[]\>

Defined in: [packages/framework/esm-offline/src/sync.ts:281](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L281)

Returns all currently queued up sync items of a given user.

## Type Parameters

### T

`T`

## Parameters

### userId

`string`

The ID of the user whose synchronization items should be returned.

### type?

`string`

The identifying type of the synchronization items to be returned..

## Returns

`Promise`\<[`SyncItem`](../interfaces/SyncItem.md)\<`T`\>[]\>
