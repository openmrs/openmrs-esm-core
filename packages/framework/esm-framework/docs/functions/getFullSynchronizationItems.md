[O3 Framework](../API.md) / getFullSynchronizationItems

# Function: getFullSynchronizationItems()

> **getFullSynchronizationItems**\<`T`\>(`type?`): `Promise`\<[`SyncItem`](../interfaces/SyncItem.md)\<`T`\>[]\>

Defined in: [packages/framework/esm-offline/src/sync.ts:302](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L302)

Returns all currently queued up sync items of the currently signed in user.

## Type Parameters

### T

`T`

## Parameters

### type?

`string`

The identifying type of the synchronization items to be returned.

## Returns

`Promise`\<[`SyncItem`](../interfaces/SyncItem.md)\<`T`\>[]\>
