[@openmrs/esm-framework](../API.md) / ExtensionInfo

# Interface: ExtensionInfo

## Hierarchy

- [`ExtensionRegistration`](ExtensionRegistration.md)

  ↳ **`ExtensionInfo`**

## Table of contents

### Properties

- [instances](ExtensionInfo.md#instances)
- [meta](ExtensionInfo.md#meta)
- [moduleName](ExtensionInfo.md#modulename)
- [name](ExtensionInfo.md#name)
- [offline](ExtensionInfo.md#offline)
- [online](ExtensionInfo.md#online)
- [order](ExtensionInfo.md#order)

### Methods

- [load](ExtensionInfo.md#load)

## Properties

### instances

• **instances**: [`ExtensionInstance`](ExtensionInstance.md)[]

The instances where the extension has been rendered using `renderExtension`.

#### Defined in

[packages/framework/esm-extensions/src/store.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L28)

___

### meta

• **meta**: [`ExtensionMeta`](ExtensionMeta.md)

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[meta](ExtensionRegistration.md#meta)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L18)

___

### moduleName

• **moduleName**: `string`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[moduleName](ExtensionRegistration.md#modulename)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L17)

___

### name

• **name**: `string`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[name](ExtensionRegistration.md#name)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L15)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[offline](ExtensionRegistration.md#offline)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L21)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[online](ExtensionRegistration.md#online)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L20)

___

### order

• `Optional` **order**: `number`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[order](ExtensionRegistration.md#order)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L19)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[load](ExtensionRegistration.md#load)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L16)
