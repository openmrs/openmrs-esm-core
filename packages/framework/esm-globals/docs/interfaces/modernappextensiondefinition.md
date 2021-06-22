[@openmrs/esm-globals](../API.md) / ModernAppExtensionDefinition

# Interface: ModernAppExtensionDefinition

## Hierarchy

- [ExtensionComponentDefinition](extensioncomponentdefinition.md)

  ↳ **ModernAppExtensionDefinition**

## Table of contents

### Properties

- [id](modernappextensiondefinition.md#id)
- [meta](modernappextensiondefinition.md#meta)
- [offline](modernappextensiondefinition.md#offline)
- [online](modernappextensiondefinition.md#online)
- [order](modernappextensiondefinition.md#order)
- [resources](modernappextensiondefinition.md#resources)
- [slot](modernappextensiondefinition.md#slot)
- [slots](modernappextensiondefinition.md#slots)

### Methods

- [load](modernappextensiondefinition.md#load)

## Properties

### id

• **id**: `string`

The ID of the extension to register.

#### Defined in

[types.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L112)

___

### meta

• `Optional` **meta**: `Record`<string, any\>

The meta data used for reflection by other components.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[meta](extensioncomponentdefinition.md#meta)

#### Defined in

[types.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L100)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[offline](extensioncomponentdefinition.md#offline)

#### Defined in

[types.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L89)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[online](extensioncomponentdefinition.md#online)

#### Defined in

[types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L85)

___

### order

• `Optional` **order**: `number`

Specifies a preferred order number, if any.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[order](extensioncomponentdefinition.md#order)

#### Defined in

[types.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L104)

___

### resources

• `Optional` **resources**: `Record`<string, [ResourceLoader](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[resources](extensioncomponentdefinition.md#resources)

#### Defined in

[types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L93)

___

### slot

• `Optional` **slot**: `string`

The slot of the extension to optionally attach to.

#### Defined in

[types.ts:116](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L116)

___

### slots

• `Optional` **slots**: `string`[]

The slots of the extension to optionally attach to.

#### Defined in

[types.ts:120](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L120)

## Methods

### load

▸ **load**(): `Promise`<any\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<any\>

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[load](extensioncomponentdefinition.md#load)

#### Defined in

[types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
