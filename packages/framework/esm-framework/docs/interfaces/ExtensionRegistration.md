[@openmrs/esm-framework](../API.md) / ExtensionRegistration

# Interface: ExtensionRegistration

## Hierarchy

- **`ExtensionRegistration`**

  ↳ [`ExtensionInfo`](ExtensionInfo.md)

## Table of contents

### Properties

- [meta](ExtensionRegistration.md#meta)
- [moduleName](ExtensionRegistration.md#modulename)
- [name](ExtensionRegistration.md#name)
- [offline](ExtensionRegistration.md#offline)
- [online](ExtensionRegistration.md#online)
- [order](ExtensionRegistration.md#order)

### Methods

- [load](ExtensionRegistration.md#load)

## Properties

### meta

• **meta**: [`ExtensionMeta`](ExtensionMeta.md)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L18)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L17)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L15)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L21)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L20)

___

### order

• `Optional` **order**: `number`

#### Defined in

[packages/framework/esm-extensions/src/store.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L19)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[packages/framework/esm-extensions/src/store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L16)
