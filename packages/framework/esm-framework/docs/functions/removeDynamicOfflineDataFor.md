[O3 Framework](../API.md) / removeDynamicOfflineDataFor

# Function: removeDynamicOfflineDataFor()

> **removeDynamicOfflineDataFor**(`userId`, `type`, `identifier`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:213](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L213)

Declares that dynamic offline data of the given [type](#removedynamicofflinedatafor) with the given [identifier](#removedynamicofflinedatafor)
no longer needs to be available offline for the user with the given ID.

## Parameters

### userId

`string`

The ID of the user who doesn't require the specified offline data.

### type

`string`

The type of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

## Returns

`Promise`\<`void`\>
