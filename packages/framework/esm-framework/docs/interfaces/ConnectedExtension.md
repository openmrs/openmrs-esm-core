[@openmrs/esm-framework](../API.md) / ConnectedExtension

# Interface: ConnectedExtension

We have the following extension modes:

- attached (set via code in form of: attach, detach, ...)
- configured (set via configuration in form of: added, removed, ...)
- assigned (computed from attached and configured)
- connected (computed from assigned using connectivity and online / offline)

## Hierarchy

- [`ExtensionRegistration`](ExtensionRegistration.md)

  ↳ **`ConnectedExtension`**

## Table of contents

### Properties

- [id](ConnectedExtension.md#id)
- [meta](ConnectedExtension.md#meta)
- [moduleName](ConnectedExtension.md#modulename)
- [name](ConnectedExtension.md#name)
- [offline](ConnectedExtension.md#offline)
- [online](ConnectedExtension.md#online)
- [order](ConnectedExtension.md#order)

### Methods

- [load](ConnectedExtension.md#load)

## Properties

### id

• **id**: `string`

#### Defined in

[packages/framework/esm-react-utils/src/useConnectedExtensions.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-react-utils/src/useConnectedExtensions.ts#L28)

___

### meta

• **meta**: [`ExtensionMeta`](ExtensionMeta.md)

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[meta](ExtensionRegistration.md#meta)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:16](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L16)

___

### moduleName

• **moduleName**: `string`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[moduleName](ExtensionRegistration.md#modulename)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L15)

___

### name

• **name**: `string`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[name](ExtensionRegistration.md#name)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L13)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[offline](ExtensionRegistration.md#offline)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L19)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[online](ExtensionRegistration.md#online)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L18)

___

### order

• `Optional` **order**: `number`

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[order](ExtensionRegistration.md#order)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L17)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[ExtensionRegistration](ExtensionRegistration.md).[load](ExtensionRegistration.md#load)

#### Defined in

[packages/framework/esm-extensions/src/store.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/store.ts#L14)
