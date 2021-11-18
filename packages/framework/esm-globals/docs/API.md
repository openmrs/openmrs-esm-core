[Back to README.md](../README.md)

# @openmrs/esm-globals

## Table of contents

### Interfaces

- [ComponentDefinition](interfaces/ComponentDefinition.md)
- [ConnectivityChangedEvent](interfaces/ConnectivityChangedEvent.md)
- [ExtensionComponentDefinition](interfaces/ExtensionComponentDefinition.md)
- [ImportMap](interfaces/ImportMap.md)
- [LegacyAppExtensionDefinition](interfaces/LegacyAppExtensionDefinition.md)
- [ModernAppExtensionDefinition](interfaces/ModernAppExtensionDefinition.md)
- [PageDefinition](interfaces/PageDefinition.md)
- [PrecacheStaticDependenciesEvent](interfaces/PrecacheStaticDependenciesEvent.md)
- [ResourceLoader](interfaces/ResourceLoader.md)
- [ShowNotificationEvent](interfaces/ShowNotificationEvent.md)
- [ShowToastEvent](interfaces/ShowToastEvent.md)
- [SpaConfig](interfaces/SpaConfig.md)

### Type aliases

- [AppExtensionDefinition](API.md#appextensiondefinition)
- [SpaEnvironment](API.md#spaenvironment)

### Functions

- [dispatchConnectivityChanged](API.md#dispatchconnectivitychanged)
- [dispatchNotificationShown](API.md#dispatchnotificationshown)
- [dispatchPrecacheStaticDependencies](API.md#dispatchprecachestaticdependencies)
- [setupPaths](API.md#setuppaths)
- [setupUtils](API.md#setuputils)
- [subscribeConnectivity](API.md#subscribeconnectivity)
- [subscribeConnectivityChanged](API.md#subscribeconnectivitychanged)
- [subscribeNotificationShown](API.md#subscribenotificationshown)
- [subscribePrecacheStaticDependencies](API.md#subscribeprecachestaticdependencies)
- [subscribeToastShown](API.md#subscribetoastshown)

## Type aliases

### AppExtensionDefinition

Ƭ **AppExtensionDefinition**: [`ModernAppExtensionDefinition`](interfaces/ModernAppExtensionDefinition.md) & [`LegacyAppExtensionDefinition`](interfaces/LegacyAppExtensionDefinition.md)

#### Defined in

[types.ts:144](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L144)

___

### SpaEnvironment

Ƭ **SpaEnvironment**: ``"production"`` \| ``"development"`` \| ``"test"``

#### Defined in

[types.ts:47](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L47)

## Functions

### dispatchConnectivityChanged

▸ **dispatchConnectivityChanged**(`online`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `online` | `boolean` |

#### Returns

`void`

#### Defined in

[events.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L7)

___

### dispatchNotificationShown

▸ **dispatchNotificationShown**(`data`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`ShowNotificationEvent`](interfaces/ShowNotificationEvent.md) |

#### Returns

`void`

#### Defined in

[events.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L81)

___

### dispatchPrecacheStaticDependencies

▸ **dispatchPrecacheStaticDependencies**(`data?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`PrecacheStaticDependenciesEvent`](interfaces/PrecacheStaticDependenciesEvent.md) |

#### Returns

`void`

#### Defined in

[events.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L34)

___

### setupPaths

▸ **setupPaths**(`config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`SpaConfig`](interfaces/SpaConfig.md) |

#### Returns

`void`

#### Defined in

[globals.ts:3](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L3)

___

### setupUtils

▸ **setupUtils**(): `void`

#### Returns

`void`

#### Defined in

[globals.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/globals.ts#L11)

___

### subscribeConnectivity

▸ **subscribeConnectivity**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [`ConnectivityChangedEvent`](interfaces/ConnectivityChangedEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L22)

___

### subscribeConnectivityChanged

▸ **subscribeConnectivityChanged**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`ev`: [`ConnectivityChangedEvent`](interfaces/ConnectivityChangedEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L13)

___

### subscribeNotificationShown

▸ **subscribeNotificationShown**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`ShowNotificationEvent`](interfaces/ShowNotificationEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:87](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L87)

___

### subscribePrecacheStaticDependencies

▸ **subscribePrecacheStaticDependencies**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`PrecacheStaticDependenciesEvent`](interfaces/PrecacheStaticDependenciesEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:42](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L42)

___

### subscribeToastShown

▸ **subscribeToastShown**(`cb`): () => `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`data`: [`ShowToastEvent`](interfaces/ShowToastEvent.md)) => `void` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[events.ts:95](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/events.ts#L95)
