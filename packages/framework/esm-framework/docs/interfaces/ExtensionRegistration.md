[@openmrs/esm-framework](../API.md) / ExtensionRegistration

# Interface: ExtensionRegistration

## Table of contents

### Extension Properties

- [featureFlag](ExtensionRegistration.md#featureflag)
- [meta](ExtensionRegistration.md#meta)
- [moduleName](ExtensionRegistration.md#modulename)
- [name](ExtensionRegistration.md#name)
- [offline](ExtensionRegistration.md#offline)
- [online](ExtensionRegistration.md#online)
- [order](ExtensionRegistration.md#order)
- [privileges](ExtensionRegistration.md#privileges)

### Methods

- [load](ExtensionRegistration.md#load)

## Extension Properties

### featureFlag

• `Optional` `Readonly` **featureFlag**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L21)

___

### meta

• `Readonly` **meta**: `Readonly`<[`ExtensionMeta`](ExtensionMeta.md)\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L16)

___

### moduleName

• `Readonly` **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L15)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L13)

___

### offline

• `Optional` `Readonly` **offline**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L19)

___

### online

• `Optional` `Readonly` **online**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L18)

___

### order

• `Optional` `Readonly` **order**: `number`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L17)

___

### privileges

• `Optional` `Readonly` **privileges**: `string` \| `string`[]

#### Defined in

[packages/framework/esm-extensions/src/store.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L20)

## Methods

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L14)
