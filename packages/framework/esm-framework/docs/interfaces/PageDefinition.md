[@openmrs/esm-framework](../API.md) / PageDefinition

# Interface: PageDefinition

## Hierarchy

- [`ComponentDefinition`](ComponentDefinition.md)

  ↳ **`PageDefinition`**

## Table of contents

### Properties

- [offline](PageDefinition.md#offline)
- [online](PageDefinition.md#online)
- [privilege](PageDefinition.md#privilege)
- [resources](PageDefinition.md#resources)
- [route](PageDefinition.md#route)

### Methods

- [load](PageDefinition.md#load)

## Properties

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[offline](ComponentDefinition.md#offline)

#### Defined in

[packages/framework/esm-globals/src/types.ts:94](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L94)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[online](ComponentDefinition.md#online)

#### Defined in

[packages/framework/esm-globals/src/types.ts:90](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L90)

___

### privilege

• `Optional` **privilege**: `string`

Defines the access privilege required for this component, if any.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[privilege](ComponentDefinition.md#privilege)

#### Defined in

[packages/framework/esm-globals/src/types.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L98)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[resources](ComponentDefinition.md#resources)

#### Defined in

[packages/framework/esm-globals/src/types.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L102)

___

### route

• **route**: `string`

The route of the page.

#### Defined in

[packages/framework/esm-globals/src/types.ts:147](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L147)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<`any`\>

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[load](ComponentDefinition.md#load)

#### Defined in

[packages/framework/esm-globals/src/types.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L86)
