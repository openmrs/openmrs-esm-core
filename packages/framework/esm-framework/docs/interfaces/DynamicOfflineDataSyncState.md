[O3 Framework](../API.md) / DynamicOfflineDataSyncState

# Interface: DynamicOfflineDataSyncState

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:73](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L73)

Represents the result of syncing a given [DynamicOfflineData](DynamicOfflineData.md) entry.

## Properties

### erroredHandlers

> **erroredHandlers**: `string`[]

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L89)

The IDs of the handlers which failed to synchronize their data.

***

### errors

> **errors**: `object`[]

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L93)

A collection of the errors caught while synchronizing, per handler.

#### handlerId

> **handlerId**: `string`

#### message

> **message**: `string`

***

### succeededHandlers

> **succeededHandlers**: `string`[]

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L85)

The IDs of the handlers which successfully synchronized their data.

***

### syncedBy

> **syncedBy**: `string`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L81)

The ID of the user who has triggered the data synchronization.

***

### syncedOn

> **syncedOn**: `Date`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L77)

The time when the entry has been synced the last time.
