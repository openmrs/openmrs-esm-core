[@openmrs/esm-framework](../API.md) / OfflinePatientDataSyncState

# Interface: OfflinePatientDataSyncState

**`deprecated`** Will be removed once all modules have been migrated to the new dynamic offline data API.

## Table of contents

### Offline Properties

- [errors](OfflinePatientDataSyncState.md#errors)
- [failedHandlers](OfflinePatientDataSyncState.md#failedhandlers)
- [syncedHandlers](OfflinePatientDataSyncState.md#syncedhandlers)
- [syncingHandlers](OfflinePatientDataSyncState.md#syncinghandlers)
- [timestamp](OfflinePatientDataSyncState.md#timestamp)

### Methods

- [abort](OfflinePatientDataSyncState.md#abort)

## Offline Properties

### errors

• `Readonly` **errors**: `Record`<`string`, `string`\>

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L20)

___

### failedHandlers

• `Readonly` **failedHandlers**: `string`[]

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L19)

___

### syncedHandlers

• `Readonly` **syncedHandlers**: `string`[]

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L18)

___

### syncingHandlers

• `Readonly` **syncingHandlers**: `string`[]

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L17)

___

### timestamp

• `Readonly` **timestamp**: `Date`

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L16)

## Methods

### abort

▸ **abort**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L21)
