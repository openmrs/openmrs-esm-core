[Back to README.md](../README.md)

# @openmrs/esm-globals

## Table of contents

### Interfaces

- [ComponentDefinition](interfaces/componentdefinition.md)
- [ConnectivityChangedEvent](interfaces/connectivitychangedevent.md)
- [ImportMap](interfaces/importmap.md)
- [LegacyAppExtensionDefinition](interfaces/legacyappextensiondefinition.md)
- [ModernAppExtensionDefinition](interfaces/modernappextensiondefinition.md)
- [PageDefinition](interfaces/pagedefinition.md)
- [ResourceLoader](interfaces/resourceloader.md)
- [ShowNotificationEvent](interfaces/shownotificationevent.md)
- [SpaConfig](interfaces/spaconfig.md)

### Type aliases

- [AppExtensionDefinition](API.md#appextensiondefinition)
- [SpaEnvironment](API.md#spaenvironment)

### Functions

- [dispatchConnectivityChanged](API.md#dispatchconnectivitychanged)
- [dispatchNotificationShown](API.md#dispatchnotificationshown)
- [setupPaths](API.md#setuppaths)
- [setupUtils](API.md#setuputils)
- [subscribeConnectivity](API.md#subscribeconnectivity)
- [subscribeConnectivityChanged](API.md#subscribeconnectivitychanged)
- [subscribeNotificationShown](API.md#subscribenotificationshown)

## Type aliases

### AppExtensionDefinition

Ƭ **AppExtensionDefinition**: [*ModernAppExtensionDefinition*](interfaces/modernappextensiondefinition.md) & [*LegacyAppExtensionDefinition*](interfaces/legacyappextensiondefinition.md)

Defined in: [types.ts:126](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L126)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

Defined in: [types.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L47)

## Functions

### dispatchConnectivityChanged

▸ **dispatchConnectivityChanged**(`online`: *boolean*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | *boolean* |

**Returns:** *void*

Defined in: [events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L7)

___

### dispatchNotificationShown

▸ **dispatchNotificationShown**(`data`: [*ShowNotificationEvent*](interfaces/shownotificationevent.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [*ShowNotificationEvent*](interfaces/shownotificationevent.md) |

**Returns:** *void*

Defined in: [events.ts:46](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L46)

___

### setupPaths

▸ **setupPaths**(`config`: [*SpaConfig*](interfaces/spaconfig.md)): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [*SpaConfig*](interfaces/spaconfig.md) |

**Returns:** *void*

Defined in: [globals.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L3)

___

### setupUtils

▸ **setupUtils**(): *void*

**Returns:** *void*

Defined in: [globals.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L11)

___

### subscribeConnectivity

▸ **subscribeConnectivity**(`cb`: (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L22)

___

### subscribeConnectivityChanged

▸ **subscribeConnectivityChanged**(`cb`: (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L13)

___

### subscribeNotificationShown

▸ **subscribeNotificationShown**(`cb`: (`data`: [*ShowNotificationEvent*](interfaces/shownotificationevent.md)) => *void*): *function*

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [*ShowNotificationEvent*](interfaces/shownotificationevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L52)
