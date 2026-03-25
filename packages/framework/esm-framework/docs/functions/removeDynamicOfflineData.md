[O3 Framework](../API.md) / removeDynamicOfflineData

# Function: removeDynamicOfflineData()

> **removeDynamicOfflineData**(`type`, `identifier`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:201](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L201)

Declares that dynamic offline data of the given [type](#removedynamicofflinedata) with the given [identifier](#removedynamicofflinedata)
no longer needs to be available offline for the currently logged in user.

## Parameters

### type

`string`

The type of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

## Returns

`Promise`\<`void`\>
