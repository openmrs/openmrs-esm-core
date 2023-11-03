[@openmrs/esm-framework](../API.md) / OfflinePatientDataSyncHandler

# Interface: OfflinePatientDataSyncHandler

**`deprecated`** Will be removed once all modules have been migrated to the new dynamic offline data API.

## Table of contents

### Offline Properties

- [displayName](OfflinePatientDataSyncHandler.md#displayname)

### Methods

- [onOfflinePatientAdded](OfflinePatientDataSyncHandler.md#onofflinepatientadded)

## Offline Properties

### displayName

• `Readonly` **displayName**: `string`

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L26)

## Methods

### onOfflinePatientAdded

▸ **onOfflinePatientAdded**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`OfflinePatientArgs`](OfflinePatientArgs.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/offline-patient-data.ts#L27)
