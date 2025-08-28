[O3 Framework](../API.md) / SyncItem

# Interface: SyncItem\<T\>

Defined in: [packages/framework/esm-offline/src/sync.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L12)

Defines an item queued up in the offline synchronization queue.
A `SyncItem` contains both meta information about the item in the sync queue, as well as the
actual data to be synchronized (i.e. the item's `content`).

## Type Parameters

### T

`T` = `any`

## Properties

### content

> **content**: `T`

Defined in: [packages/framework/esm-offline/src/sync.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L16)

***

### createdOn

> **createdOn**: `Date`

Defined in: [packages/framework/esm-offline/src/sync.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L17)

***

### descriptor

> **descriptor**: [`QueueItemDescriptor`](QueueItemDescriptor.md)

Defined in: [packages/framework/esm-offline/src/sync.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L18)

***

### id?

> `optional` **id**: `number`

Defined in: [packages/framework/esm-offline/src/sync.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L13)

***

### lastError?

> `optional` **lastError**: `object`

Defined in: [packages/framework/esm-offline/src/sync.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L19)

#### message?

> `optional` **message**: `string`

#### name?

> `optional` **name**: `string`

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-offline/src/sync.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L15)

***

### userId

> **userId**: `string`

Defined in: [packages/framework/esm-offline/src/sync.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L14)
