[O3 Framework](../API.md) / putDynamicOfflineData

# Function: putDynamicOfflineData()

> **putDynamicOfflineData**(`type`, `identifier`): `Promise`\<`void`\>

Defined in: [packages/framework/esm-offline/src/dynamic-offline-data.ts:157](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-offline/src/dynamic-offline-data.ts#L157)

Declares that dynamic offline data of the given [type](#putdynamicofflinedata) with the given [identifier](#putdynamicofflinedata)
should be made available offline for the currently logged in user.

## Parameters

### type

`string`

The type of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

### identifier

`string`

The identifier of the offline data. See [DynamicOfflineData](../interfaces/DynamicOfflineData.md) for details.

## Returns

`Promise`\<`void`\>
