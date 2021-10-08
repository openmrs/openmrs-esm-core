[@openmrs/esm-framework](../API.md) / OfflinePatientDataSyncState

# Interface: OfflinePatientDataSyncState

## Table of contents

### Properties

- [errors](OfflinePatientDataSyncState.md#errors)
- [failedHandlers](OfflinePatientDataSyncState.md#failedhandlers)
- [syncedHandlers](OfflinePatientDataSyncState.md#syncedhandlers)
- [syncingHandlers](OfflinePatientDataSyncState.md#syncinghandlers)
- [timestamp](OfflinePatientDataSyncState.md#timestamp)

### Methods

- [abort](OfflinePatientDataSyncState.md#abort)

## Properties

### errors

• `Readonly` **errors**: `Record`<`string`, `string`\>

A set of error messages associated with the identifers of the failed handlers.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L41)

___

### failedHandlers

• `Readonly` **failedHandlers**: `string`[]

A list of the data sync handler registration identifiers which failed to synchronize the
patient's data.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L37)

___

### syncedHandlers

• `Readonly` **syncedHandlers**: `string`[]

A list of the data sync handler registration identifiers which successfully synchronized the
patient's data.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L32)

___

### syncingHandlers

• `Readonly` **syncingHandlers**: `string`[]

A list of the data sync handler registration identifiers which are still in the process
of synchronizing the patient's data.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L27)

___

### timestamp

• `Readonly` **timestamp**: `Date`

The time when this state snapshot was initially created.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L22)

## Methods

### abort

▸ **abort**(): `boolean`

Aborts the process of downloading data.

#### Returns

`boolean`

`true` if the cancellation could be triggered (that is, if there were any syncing handlers);
  `false` if not.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L47)
