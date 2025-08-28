[O3 Framework](../API.md) / syncAllDynamicOfflineData

# Function: syncAllDynamicOfflineData()

> **syncAllDynamicOfflineData**(`type`, `abortSignal?`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:241](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L241)

Synchronizes all offline data entries of the given [type](#syncalldynamicofflinedata) for the currently logged in user.

## Parameters

### type

`string`

The type of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### abortSignal?

`AbortSignal`

An `AbortSignal` which can be used to cancel the operation.

## Returns

`Promise`\<`void`\>
