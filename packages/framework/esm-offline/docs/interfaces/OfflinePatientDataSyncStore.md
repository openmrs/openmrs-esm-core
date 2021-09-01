[@openmrs/esm-offline](../API.md) / OfflinePatientDataSyncStore

# Interface: OfflinePatientDataSyncStore

## Table of contents

### Properties

- [handlers](OfflinePatientDataSyncStore.md#handlers)
- [offlinePatientDataSyncState](OfflinePatientDataSyncStore.md#offlinepatientdatasyncstate)

## Properties

### handlers

• **handlers**: `Record`<`string`, [`OfflinePatientDataSyncHandler`](OfflinePatientDataSyncHandler.md)\>

Holds the list of currently registered handlers which deal with patients that should be available offline.
The key is a unique identifier which, once defined, should never change as it gives identity to
the handler registration.

#### Defined in

[offline-patient-data.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L15)

___

### offlinePatientDataSyncState

• **offlinePatientDataSyncState**: `Record`<`string`, [`OfflinePatientDataSyncState`](OfflinePatientDataSyncState.md)\>

For each patient ID of the patients whose data is currently made available offline, provides
the current data synchronizaton state.

#### Defined in

[offline-patient-data.ts:9](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L9)
