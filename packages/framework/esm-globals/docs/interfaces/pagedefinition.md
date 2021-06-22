[@openmrs/esm-globals](../API.md) / PageDefinition

# Interface: PageDefinition

## Hierarchy

- [ComponentDefinition](componentdefinition.md)

  ↳ **PageDefinition**

## Table of contents

### Properties

- [offline](pagedefinition.md#offline)
- [online](pagedefinition.md#online)
- [resources](pagedefinition.md#resources)
- [route](pagedefinition.md#route)

### Methods

- [load](pagedefinition.md#load)

## Properties

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ComponentDefinition](componentdefinition.md).[offline](componentdefinition.md#offline)

#### Defined in

[types.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L89)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ComponentDefinition](componentdefinition.md).[online](componentdefinition.md#online)

#### Defined in

[types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L85)

___

### resources

• `Optional` **resources**: `Record`<string, [ResourceLoader](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ComponentDefinition](componentdefinition.md).[resources](componentdefinition.md#resources)

#### Defined in

[types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L93)

___

### route

• **route**: `string`

The route of the page.

#### Defined in

[types.ts:138](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L138)

## Methods

### load

▸ **load**(): `Promise`<any\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<any\>

#### Inherited from

[ComponentDefinition](componentdefinition.md).[load](componentdefinition.md#load)

#### Defined in

[types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
