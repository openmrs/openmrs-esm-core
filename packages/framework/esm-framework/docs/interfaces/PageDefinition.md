[@openmrs/esm-framework](../API.md) / PageDefinition

# Interface: PageDefinition

## Hierarchy

- [`ComponentDefinition`](ComponentDefinition.md)

  ↳ **`PageDefinition`**

## Table of contents

### Properties

- [appName](PageDefinition.md#appname)
- [offline](PageDefinition.md#offline)
- [online](PageDefinition.md#online)
- [order](PageDefinition.md#order)
- [privilege](PageDefinition.md#privilege)
- [resources](PageDefinition.md#resources)
- [route](PageDefinition.md#route)

### Methods

- [load](PageDefinition.md#load)

## Properties

### appName

• **appName**: `string`

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[appName](ComponentDefinition.md#appname)

#### Defined in

[packages/framework/esm-globals/src/types.ts:99](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L99)

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

• **order**: `number`

#### Defined in

[packages/framework/esm-globals/src/types.ts:146](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L146)

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

### route

• **route**: `string`

#### Defined in

[packages/framework/esm-globals/src/types.ts:142](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L142)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[load](ComponentDefinition.md#load)

#### Defined in

[packages/framework/esm-globals/src/types.ts:103](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-globals/src/types.ts#L103)
