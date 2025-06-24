[O3 Framework](../API.md) / DynamicOfflineDataHandler

# Interface: DynamicOfflineDataHandler

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:10](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L10)

A handler for synchronizing dynamically declared offline data.
Can be setup using the [setupDynamicOfflineDataHandler](../functions/setupDynamicOfflineDataHandler.md) function.

## Properties

### displayName?

> `optional` **displayName**: `string`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L24)

A human-readable string representing the handler.
If provided, the handler can be rendered in the UI using that string.

***

### id

> **id**: `string`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L14)

A string uniquely identifying the handler.

***

### type

> **type**: `string`

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L19)

The type of offline data handled by this handler.
See [DynamicOfflineData.type](DynamicOfflineData.md#type) for details.

## Methods

### isSynced()

> **isSynced**(`identifier`, `abortSignal?`): `Promise`\<`boolean`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L32)

Evaluates whether the given offline data is correctly synced at this point in time from the perspective
of this single handler.
If `false`, the handler would have to (re-)sync the data in order for offline mode to properly work.

#### Parameters

##### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](DynamicOfflineData.md) for details.

##### abortSignal?

`AbortSignal`

An `AbortSignal` which can be used to cancel the operation.

#### Returns

`Promise`\<`boolean`\>

***

### sync()

> **sync**(`identifier`, `abortSignal?`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L38)

Synchronizes the given offline data.

#### Parameters

##### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](DynamicOfflineData.md) for details.

##### abortSignal?

`AbortSignal`

An `AbortSignal` which can be used to cancel the operation.

#### Returns

`Promise`\<`void`\>
