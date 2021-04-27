[Back to README.md](../README.md)

# @openmrs/esm-globals

## Table of contents

### Interfaces

- [ConnectivityChangedEvent](interfaces/connectivitychangedevent.md)
- [ImportMap](interfaces/importmap.md)
- [LegacyAppExtensionDefinition](interfaces/legacyappextensiondefinition.md)
- [ModernAppExtensionDefinition](interfaces/modernappextensiondefinition.md)
- [PageDefinition](interfaces/pagedefinition.md)
- [ShowToastEvent](interfaces/showtoastevent.md)
- [SpaConfig](interfaces/spaconfig.md)

### Type aliases

- [AppExtensionDefinition](API.md#appextensiondefinition)
- [SpaEnvironment](API.md#spaenvironment)

### Functions

- [dispatchConnectivityChanged](API.md#dispatchconnectivitychanged)
- [dispatchToastShown](API.md#dispatchtoastshown)
- [setupPaths](API.md#setuppaths)
- [setupUtils](API.md#setuputils)
- [subscribeConnectivity](API.md#subscribeconnectivity)
- [subscribeConnectivityChanged](API.md#subscribeconnectivitychanged)
- [subscribeToastShown](API.md#subscribetoastshown)

## Type aliases

### AppExtensionDefinition

Ƭ **AppExtensionDefinition**: [*ModernAppExtensionDefinition*](interfaces/modernappextensiondefinition.md) & [*LegacyAppExtensionDefinition*](interfaces/legacyappextensiondefinition.md)

Defined in: [types.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/types.ts#L57)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

Defined in: [types.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/types.ts#L16)

## Functions

### dispatchConnectivityChanged

▸ **dispatchConnectivityChanged**(`online`: *boolean*): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `online` | *boolean* |

**Returns:** *void*

Defined in: [events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/events.ts#L7)

___

### dispatchToastShown

▸ **dispatchToastShown**(`data`: [*ShowToastEvent*](interfaces/showtoastevent.md)): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `data` | [*ShowToastEvent*](interfaces/showtoastevent.md) |

**Returns:** *void*

Defined in: [events.ts:45](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/events.ts#L45)

___

### setupPaths

▸ **setupPaths**(`config`: [*SpaConfig*](interfaces/spaconfig.md)): *void*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `config` | [*SpaConfig*](interfaces/spaconfig.md) |

**Returns:** *void*

Defined in: [globals.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/globals.ts#L3)

___

### setupUtils

▸ **setupUtils**(): *void*

**Returns:** *void*

Defined in: [globals.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/globals.ts#L11)

___

### subscribeConnectivity

▸ **subscribeConnectivity**(`cb`: (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void*): *function*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/events.ts#L22)

___

### subscribeConnectivityChanged

▸ **subscribeConnectivityChanged**(`cb`: (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void*): *function*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [*ConnectivityChangedEvent*](interfaces/connectivitychangedevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/events.ts#L13)

___

### subscribeToastShown

▸ **subscribeToastShown**(`cb`: (`data`: [*ShowToastEvent*](interfaces/showtoastevent.md)) => *void*): *function*

#### Parameters:

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [*ShowToastEvent*](interfaces/showtoastevent.md)) => *void* |

**Returns:** () => *void*

Defined in: [events.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/events.ts#L49)
