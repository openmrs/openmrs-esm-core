[O3 Framework](../API.md) / DynamicOfflineData

# Interface: DynamicOfflineData

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L44)

Represents the registration of a single dynamic offline data entry.

## Properties

### id?

> `optional` **id**: `number`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:48](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L48)

The internal ID of the data entry, as assigned by the IndexedDB where it is stored.

***

### identifier

> **identifier**: `string`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L58)

The externally provided identifier of the data entry.
This is typically the ID of the resource as assigned by a remote API.

***

### syncState?

> `optional` **syncState**: [`DynamicOfflineDataSyncState`](DynamicOfflineDataSyncState.md)

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L67)

If this entry has already been synced, returns the result of that last sync attempt.
Otherwise this is `undefined`.

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L53)

The underlying type used for categorizing the data entry.
Examples could be `"patient"` or `"form"`.

***

### users

> **users**: `string`[]

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L62)

The UUIDs of the users who need this data entry available offline.
