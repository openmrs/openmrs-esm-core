[@openmrs/esm-offline](../API.md) / OfflinePatientDataSyncHandler

# Interface: OfflinePatientDataSyncHandler

## Table of contents

### Properties

- [displayName](OfflinePatientDataSyncHandler.md#displayname)

### Methods

- [onOfflinePatientAdded](OfflinePatientDataSyncHandler.md#onofflinepatientadded)

## Properties

### displayName

• `Readonly` **displayName**: `string`

A name of the handler registration which can be displayed to the user.
This is ideally translated.

#### Defined in

[offline-patient-data.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L49)

## Methods

### onOfflinePatientAdded

▸ **onOfflinePatientAdded**(`args`): `Promise`<`void`\>

A function which is invoked when a patient is added to the app's offline patient cache.
Signals to the handler that the patient's data must be made available offline.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | [`OfflinePatientArgs`](OfflinePatientArgs.md) | Arguments which provide data about the patient to be made available offline. |

#### Returns

`Promise`<`void`\>

A promise which should resolve if all data could be cached and reject when there was an issue
  caching the data.

#### Defined in

[offline-patient-data.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L57)
