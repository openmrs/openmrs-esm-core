[@openmrs/esm-globals](../API.md) / ExtensionComponentDefinition

# Interface: ExtensionComponentDefinition

## Hierarchy

- [`ComponentDefinition`](ComponentDefinition.md)

  ↳ **`ExtensionComponentDefinition`**

  ↳↳ [`ModernAppExtensionDefinition`](ModernAppExtensionDefinition.md)

  ↳↳ [`LegacyAppExtensionDefinition`](LegacyAppExtensionDefinition.md)

## Table of contents

### Properties

- [meta](ExtensionComponentDefinition.md#meta)
- [offline](ExtensionComponentDefinition.md#offline)
- [online](ExtensionComponentDefinition.md#online)
- [order](ExtensionComponentDefinition.md#order)
- [resources](ExtensionComponentDefinition.md#resources)
- [role](ExtensionComponentDefinition.md#role)

### Methods

- [load](ExtensionComponentDefinition.md#load)

## Properties

### meta

• `Optional` **meta**: `Record`<`string`, `any`\>

The meta data used for reflection by other components.

#### Defined in

[types.ts:109](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L109)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[offline](ComponentDefinition.md#offline)

#### Defined in

[types.ts:94](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L94)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[online](ComponentDefinition.md#online)

#### Defined in

[types.ts:90](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L90)

___

### order

• `Optional` **order**: `number`

Specifies a preferred order number, if any.

#### Defined in

[types.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L113)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[resources](ComponentDefinition.md#resources)

#### Defined in

[types.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L102)

___

### role

• `Optional` **role**: `string`

Defines the access role required for this component, if any.

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[role](ComponentDefinition.md#role)

#### Defined in

[types.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L98)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<`any`\>

#### Inherited from

[ComponentDefinition](ComponentDefinition.md).[load](ComponentDefinition.md#load)

#### Defined in

[types.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L86)
