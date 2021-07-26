[@openmrs/esm-extensions](../API.md) / ExtensionRegistration

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

[store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L15)

___

### moduleName

• **moduleName**: `string`

#### Defined in

[store.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L14)

___

### name

• **name**: `string`

#### Defined in

[store.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L12)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Defined in

[store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L18)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Defined in

[store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L17)

___

### order

• `Optional` **order**: `number`

#### Defined in

[store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L16)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L13)
