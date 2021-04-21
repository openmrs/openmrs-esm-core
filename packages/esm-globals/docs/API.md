[Back to README.md](../README.md)

# @openmrs/esm-globals

## Table of contents

### Interfaces

- [ImportMap](interfaces/importmap.md)
- [LegacyAppExtensionDefinition](interfaces/legacyappextensiondefinition.md)
- [ModernAppExtensionDefinition](interfaces/modernappextensiondefinition.md)
- [PageDefinition](interfaces/pagedefinition.md)
- [SpaConfig](interfaces/spaconfig.md)

### Type aliases

- [AppExtensionDefinition](API.md#appextensiondefinition)
- [SpaEnvironment](API.md#spaenvironment)

### Functions

- [setupPaths](API.md#setuppaths)
- [setupUtils](API.md#setuputils)

## Type aliases

### AppExtensionDefinition

Ƭ **AppExtensionDefinition**: [*ModernAppExtensionDefinition*](interfaces/modernappextensiondefinition.md) & [*LegacyAppExtensionDefinition*](interfaces/legacyappextensiondefinition.md)

Defined in: [types.ts:57](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/types.ts#L57)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

Defined in: [types.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/esm-globals/src/types.ts#L16)

## Functions

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
