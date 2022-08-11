[@openmrs/esm-framework](../API.md) / ExtensionDefinition

# Interface: ExtensionDefinition

## Hierarchy

- [`ComponentDefinition`](ComponentDefinition.md)

  ↳ **`ExtensionDefinition`**

## Table of contents

### Properties

- [appName](ExtensionDefinition.md#appname)
- [id](ExtensionDefinition.md#id)
- [meta](ExtensionDefinition.md#meta)
- [name](ExtensionDefinition.md#name)
- [offline](ExtensionDefinition.md#offline)
- [online](ExtensionDefinition.md#online)
- [order](ExtensionDefinition.md#order)
- [privilege](ExtensionDefinition.md#privilege)
- [resources](ExtensionDefinition.md#resources)
- [slot](ExtensionDefinition.md#slot)
- [slots](ExtensionDefinition.md#slots)

### Methods

- [load](ExtensionDefinition.md#load)

## Properties

### appName

• **appName**: `string`

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[appName](ComponentDefinition.md#appname)

#### Defined in

[packages/framework/esm-globals/src/types.ts:99](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L99)

___

### id

• `Optional` **id**: `string`

#### Defined in

[packages/framework/esm-globals/src/types.ts:135](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L135)

___

### meta

• `Optional` **meta**: `Record`<`string`, `any`\>

#### Defined in

[packages/framework/esm-globals/src/types.ts:131](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L131)

___

### name

• **name**: `string`

#### Defined in

[packages/framework/esm-globals/src/types.ts:125](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L125)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[offline](ComponentDefinition.md#offline)

#### Defined in

[packages/framework/esm-globals/src/types.ts:111](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L111)

___

### online

• `Optional` **online**: `boolean` \| `object`

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[online](ComponentDefinition.md#online)

#### Defined in

[packages/framework/esm-globals/src/types.ts:107](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L107)

___

### order

• `Optional` **order**: `number`

#### Defined in

[packages/framework/esm-globals/src/types.ts:133](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L133)

___

### privilege

• `Optional` **privilege**: `string` \| `string`[]

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[privilege](ComponentDefinition.md#privilege)

#### Defined in

[packages/framework/esm-globals/src/types.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L116)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[resources](ComponentDefinition.md#resources)

#### Defined in

[packages/framework/esm-globals/src/types.ts:120](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L120)

___

### slot

• `Optional` **slot**: `string`

#### Defined in

[packages/framework/esm-globals/src/types.ts:127](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L127)

___

### slots

• `Optional` **slots**: `string`[]

#### Defined in

[packages/framework/esm-globals/src/types.ts:129](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L129)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[load](ComponentDefinition.md#load)

#### Defined in

[packages/framework/esm-globals/src/types.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L103)
