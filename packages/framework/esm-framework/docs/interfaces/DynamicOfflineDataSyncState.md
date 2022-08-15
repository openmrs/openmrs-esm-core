[@openmrs/esm-framework](../API.md) / DynamicOfflineDataSyncState

# Interface: DynamicOfflineDataSyncState

Represents the result of syncing a given [DynamicOfflineData](DynamicOfflineData.md) entry.

## Table of contents

### Offline Properties

- [erroredHandlers](DynamicOfflineDataSyncState.md#erroredhandlers)
- [errors](DynamicOfflineDataSyncState.md#errors)
- [succeededHandlers](DynamicOfflineDataSyncState.md#succeededhandlers)
- [syncedBy](DynamicOfflineDataSyncState.md#syncedby)
- [syncedOn](DynamicOfflineDataSyncState.md#syncedon)

## Offline Properties

### erroredHandlers

• **erroredHandlers**: `string`[]

The IDs of the handlers which failed to synchronize their data.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L89)

___

### errors

• **errors**: { `handlerId`: `string` ; `message`: `string`  }[]

A collection of the errors caught while synchronizing, per handler.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L93)

___

### succeededHandlers

• **succeededHandlers**: `string`[]

The IDs of the handlers which successfully synchronized their data.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L85)

___

### syncedBy

• **syncedBy**: `string`

The ID of the user who has triggered the data synchronization.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L81)

___

### syncedOn

• **syncedOn**: `Date`

The time when the entry has been synced the last time.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:77](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L77)
