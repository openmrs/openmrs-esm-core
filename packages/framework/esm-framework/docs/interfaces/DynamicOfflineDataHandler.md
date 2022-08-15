[@openmrs/esm-framework](../API.md) / DynamicOfflineDataHandler

# Interface: DynamicOfflineDataHandler

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

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L24)

___

### id

• **id**: `string`

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L14)

___

### type

• **type**: `string`

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L19)

## Methods

### isSynced

▸ **isSynced**(`identifier`, `abortSignal?`): `Promise`<`boolean`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` |  |
| `abortSignal?` | `AbortSignal` |  |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L32)

___

### sync

▸ **sync**(`identifier`, `abortSignal?`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `identifier` | `string` |  |
| `abortSignal?` | `AbortSignal` |  |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/framework/esm-offline/src/dynamic-offline-data.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L38)
