[O3 Framework](../API.md) / QueueItemDescriptor

# Interface: QueueItemDescriptor

Defined in: [packages/framework/esm-offline/src/sync.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L31)

Contains information about the sync item which has been provided externally by the caller
who added the item to the queue.
This information is all optional, but, when provided while enqueuing the item, can be used in other
locations to better represent the sync item, e.g. in the UI.

## Properties

### dependencies?

> `optional` **dependencies**: `object`[]

Defined in: [packages/framework/esm-offline/src/sync.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L33)

#### id

> **id**: `string`

#### type

> **type**: `string`

***

### displayName?

> `optional` **displayName**: `string`

Defined in: [packages/framework/esm-offline/src/sync.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L38)

***

### id?

> `optional` **id**: `string`

Defined in: [packages/framework/esm-offline/src/sync.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L32)

***

### patientUuid?

> `optional` **patientUuid**: `string`

Defined in: [packages/framework/esm-offline/src/sync.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L37)
