[@openmrs/esm-framework](../API.md) / OfflinePatientDataSyncStore

# Interface: OfflinePatientDataSyncStore

## Table of contents

### Offline Properties

- [handlers](OfflinePatientDataSyncStore.md#handlers)
- [offlinePatientDataSyncState](OfflinePatientDataSyncStore.md#offlinepatientdatasyncstate)

## Offline Properties

### handlers

• **handlers**: `Record`<`string`, [`OfflinePatientDataSyncHandler`](OfflinePatientDataSyncHandler.md)\>

Holds the list of currently registered handlers which deal with patients that should be available offline.
The key is a unique identifier which, once defined, should never change as it gives identity to
the handler registration.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L16)

___

### offlinePatientDataSyncState

• **offlinePatientDataSyncState**: `Record`<`string`, [`OfflinePatientDataSyncState`](OfflinePatientDataSyncState.md)\>

For each patient ID of the patients whose data is currently made available offline, provides
the current data synchronizaton state.

#### Defined in

[packages/framework/esm-offline/src/offline-patient-data.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-offline/src/offline-patient-data.ts#L10)
