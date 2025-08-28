[O3 Framework](../API.md) / putDynamicOfflineDataFor

# Function: putDynamicOfflineDataFor()

> **putDynamicOfflineDataFor**(`userId`, `type`, `identifier`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:169](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-offline/src/dynamic-offline-data.ts#L169)

Declares that dynamic offline data of the given [type](#putdynamicofflinedatafor) with the given [identifier](#putdynamicofflinedatafor)
should be made available offline for the user with the given ID.

## Parameters

### userId

`string`

The ID of the user for whom the dynamic offline data should be made available.

### type

`string`

The type of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

## Returns

`Promise`\<`void`\>
