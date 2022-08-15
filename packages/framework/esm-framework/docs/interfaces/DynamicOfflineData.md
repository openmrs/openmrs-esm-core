[@openmrs/esm-framework](../API.md) / DynamicOfflineData

# Interface: DynamicOfflineData

Represents the registration of a single dynamic offline data entry.

## Table of contents

### Offline Properties

- [id](DynamicOfflineData.md#id)
- [identifier](DynamicOfflineData.md#identifier)
- [syncState](DynamicOfflineData.md#syncstate)
- [type](DynamicOfflineData.md#type)
- [users](DynamicOfflineData.md#users)

## Offline Properties

### id

• `Optional` **id**: `number`

The internal ID of the data entry, as assigned by the IndexedDB where it is stored.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:48](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L48)

___

### identifier

• **identifier**: `string`

The externally provided identifier of the data entry.
This is typically the ID of the resource as assigned by a remote API.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:58](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L58)

___

### syncState

• `Optional` **syncState**: [`DynamicOfflineDataSyncState`](DynamicOfflineDataSyncState.md)

If this entry has already been synced, returns the result of that last sync attempt.
Otherwise this is `undefined`.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:67](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L67)

___

### type

• **type**: `string`

The underlying type used for categorizing the data entry.
Examples could be `"patient"` or `"form"`.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L53)

___

### users

• **users**: `string`[]

The UUIDs of the users who need this data entry available offline.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L62)
