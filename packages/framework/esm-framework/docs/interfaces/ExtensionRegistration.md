[@openmrs/esm-framework](../API.md) / ExtensionRegistration

# Interface: ExtensionRegistration

## Table of contents

### Extension Properties

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

### meta

• **meta**: [`ExtensionMeta`](ExtensionMeta.md)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L20)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L19)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L17)

___

### offline

• `Optional` **offline**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:23](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L23)

___

### online

• `Optional` **online**: `boolean`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L22)

___

### order

• `Optional` **order**: `number`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L21)

___

### privileges

• `Optional` **privileges**: `string` \| `string`[]

#### Defined in

[packages/framework/esm-extensions/src/store.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L24)

## Methods

### load

▸ **load**(): `Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Returns

`Promise`<{ `default?`: `LifeCycles`<{}\>  } & `LifeCycles`<{}\>\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-extensions/src/store.ts#L18)
