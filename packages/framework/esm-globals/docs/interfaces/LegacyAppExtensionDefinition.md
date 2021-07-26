[@openmrs/esm-globals](../API.md) / LegacyAppExtensionDefinition

# Interface: LegacyAppExtensionDefinition

## Hierarchy

- [`ExtensionComponentDefinition`](ExtensionComponentDefinition.md)

  ↳ **`LegacyAppExtensionDefinition`**

## Table of contents

### Properties

- [meta](LegacyAppExtensionDefinition.md#meta)
- [name](LegacyAppExtensionDefinition.md#name)
- [offline](LegacyAppExtensionDefinition.md#offline)
- [online](LegacyAppExtensionDefinition.md#online)
- [order](LegacyAppExtensionDefinition.md#order)
- [resources](LegacyAppExtensionDefinition.md#resources)
- [role](LegacyAppExtensionDefinition.md#role)

### Methods

- [load](LegacyAppExtensionDefinition.md#load)

## Properties

### meta

• `Optional` **meta**: `Record`<`string`, `any`\>

The meta data used for reflection by other components.

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[meta](ExtensionComponentDefinition.md#meta)

#### Defined in

[types.ts:109](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L109)

___

### name

• **name**: `string`

The ID of the extension to register.

#### Defined in

[types.ts:137](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L137)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[offline](ExtensionComponentDefinition.md#offline)

#### Defined in

[types.ts:94](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L94)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[online](ExtensionComponentDefinition.md#online)

#### Defined in

[types.ts:90](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L90)

___

### order

• `Optional` **order**: `number`

Specifies a preferred order number, if any.

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[order](ExtensionComponentDefinition.md#order)

#### Defined in

[types.ts:113](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L113)

___

### resources

• `Optional` **resources**: `Record`<`string`, [`ResourceLoader`](ResourceLoader.md)<`any`\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[resources](ExtensionComponentDefinition.md#resources)

#### Defined in

[types.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L102)

___

### role

• `Optional` **role**: `string`

Defines the access role required for this component, if any.

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[role](ExtensionComponentDefinition.md#role)

#### Defined in

[types.ts:98](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L98)

## Methods

### load

▸ **load**(): `Promise`<`any`\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<`any`\>

#### Inherited from

[ExtensionComponentDefinition](ExtensionComponentDefinition.md).[load](ExtensionComponentDefinition.md#load)

#### Defined in

[types.ts:86](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L86)
