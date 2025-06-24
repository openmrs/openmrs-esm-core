[@openmrs/esm-framework](../API.md) / QueueItemDescriptor

# Interface: QueueItemDescriptor

Contains information about the sync item which has been provided externally by the caller
who added the item to the queue.
This information is all optional, but, when provided while enqueuing the item, can be used in other
locations to better represent the sync item, e.g. in the UI.

## Table of contents

### Offline Properties

- [dependencies](QueueItemDescriptor.md#dependencies)
- [displayName](QueueItemDescriptor.md#displayname)
- [id](QueueItemDescriptor.md#id)
- [patientUuid](QueueItemDescriptor.md#patientuuid)

## Offline Properties

### dependencies

• `Optional` **dependencies**: { `id`: `string` ; `type`: `string`  }[]

#### Defined in

[packages/framework/esm-offline/src/sync.ts:33](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L33)

___

### displayName

• `Optional` **displayName**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L38)

___

### id

• `Optional` **id**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L32)

___

### patientUuid

• `Optional` **patientUuid**: `string`

#### Defined in

[packages/framework/esm-offline/src/sync.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/sync.ts#L37)
