[@openmrs/esm-globals](../API.md) / [Exports](../modules.md) / ComponentDefinition

# Interface: ComponentDefinition

## Hierarchy

- **ComponentDefinition**

  ↳ [ExtensionComponentDefinition](extensioncomponentdefinition.md)

  ↳ [PageDefinition](pagedefinition.md)

## Table of contents

### Properties

- [offline](componentdefinition.md#offline)
- [online](componentdefinition.md#online)
- [resources](componentdefinition.md#resources)

### Methods

- [load](componentdefinition.md#load)

## Properties

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Defined in

[types.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L89)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Defined in

[types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L85)

___

### resources

• `Optional` **resources**: `Record`<string, [ResourceLoader](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

#### Defined in

[types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L93)

## Methods

### load

▸ **load**(): `Promise`<any\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<any\>

#### Defined in

[types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
