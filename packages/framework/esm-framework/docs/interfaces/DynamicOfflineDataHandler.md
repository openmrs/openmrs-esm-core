[@openmrs/esm-framework](../API.md) / DynamicOfflineDataHandler

# Interface: DynamicOfflineDataHandler

A handler for synchronizing dynamically declared offline data.
Can be setup using the [setupDynamicOfflineDataHandler](../API.md#setupdynamicofflinedatahandler) function.

## Table of contents

### Offline Properties

- [displayName](DynamicOfflineDataHandler.md#displayname)
- [id](DynamicOfflineDataHandler.md#id)
- [type](DynamicOfflineDataHandler.md#type)

### Methods

- [isSynced](DynamicOfflineDataHandler.md#issynced)
- [sync](DynamicOfflineDataHandler.md#sync)

## Offline Properties

### displayName

• `Optional` **displayName**: `string`

A human-readable string representing the handler.
If provided, the handler can be rendered in the UI using that string.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L24)

___

### id

• **id**: `string`

A string uniquely identifying the handler.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L14)

___

### type

• **type**: `string`

The type of offline data handled by this handler.
See [DynamicOfflineData.type](DynamicOfflineData.md#type) for details.

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L19)

## Methods

### isSynced

▸ **isSynced**(`identifier`, `abortSignal?`): `Promise`<`boolean`\>

Evaluates whether the given offline data is correctly synced at this point in time from the perspective
of this single handler.
If `false`, the handler would have to (re-)sync the data in order for offline mode to properly work.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` | The identifier of the offline data. See [DynamicOfflineData](DynamicOfflineData.md) for details. |
| `abortSignal?` | `AbortSignal` | An {@link AbortSignal} which can be used to cancel the operation. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L32)

___

### sync

▸ **sync**(`identifier`, `abortSignal?`): `Promise`<`void`\>

Synchronizes the given offline data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` | The identifier of the offline data. See [DynamicOfflineData](DynamicOfflineData.md) for details. |
| `abortSignal?` | `AbortSignal` | An {@link AbortSignal} which can be used to cancel the operation. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L38)
