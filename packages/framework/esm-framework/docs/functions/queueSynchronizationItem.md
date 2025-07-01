[O3 Framework](../API.md) / queueSynchronizationItem

# Function: queueSynchronizationItem()

> **queueSynchronizationItem**\<`T`\>(`type`, `content`, `descriptor?`): `Promise`\<`number`\>

Defined in: [packages/framework/esm-offline/src/sync.ts:261](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L261)

Enqueues a new item in the sync queue and associates the item with the currently signed in user.

## Type Parameters

### T

`T`

## Parameters

### type

`string`

The identifying type of the synchronization item.

### content

`T`

The actual data to be synchronized.

### descriptor?

[`QueueItemDescriptor`](../interfaces/QueueItemDescriptor.md)

An optional descriptor providing additional metadata about the sync item.

## Returns

`Promise`\<`number`\>
