[O3 Framework](../API.md) / syncDynamicOfflineData

# Function: syncDynamicOfflineData()

> **syncDynamicOfflineData**(`type`, `identifier`, `abortSignal?`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:254](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L254)

Synchronizes a single offline data entry of the given [type](#syncdynamicofflinedata) for the currently logged in user.

## Parameters

### type

`string`

The type of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### abortSignal?

`AbortSignal`

An `AbortSignal` which can be used to cancel the operation.

## Returns

`Promise`\<`void`\>
