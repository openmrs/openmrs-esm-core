[@openmrs/esm-framework](../API.md) / LegacyAppExtensionDefinition

# Interface: LegacyAppExtensionDefinition

## Hierarchy

- [ExtensionComponentDefinition](extensioncomponentdefinition.md)

  ↳ **LegacyAppExtensionDefinition**

## Table of contents

### Properties

- [meta](legacyappextensiondefinition.md#meta)
- [name](legacyappextensiondefinition.md#name)
- [offline](legacyappextensiondefinition.md#offline)
- [online](legacyappextensiondefinition.md#online)
- [order](legacyappextensiondefinition.md#order)
- [resources](legacyappextensiondefinition.md#resources)

### Methods

- [load](legacyappextensiondefinition.md#load)

## Properties

### meta

• `Optional` **meta**: `Record`<string, any\>

The meta data used for reflection by other components.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[meta](extensioncomponentdefinition.md#meta)

#### Defined in

[packages/framework/esm-globals/src/types.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L100)

___

### name

• **name**: `string`

The ID of the extension to register.

#### Defined in

[packages/framework/esm-globals/src/types.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L128)

___

### offline

• `Optional` **offline**: `boolean` \| `object`

Defines the offline support / properties of the component.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[offline](extensioncomponentdefinition.md#offline)

#### Defined in

[packages/framework/esm-globals/src/types.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L89)

___

### online

• `Optional` **online**: `boolean` \| `object`

Defines the online support / properties of the component.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[online](extensioncomponentdefinition.md#online)

#### Defined in

[packages/framework/esm-globals/src/types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L85)

___

### order

• `Optional` **order**: `number`

Specifies a preferred order number, if any.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[order](extensioncomponentdefinition.md#order)

#### Defined in

[packages/framework/esm-globals/src/types.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L104)

___

### resources

• `Optional` **resources**: `Record`<string, [ResourceLoader](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[resources](extensioncomponentdefinition.md#resources)

#### Defined in

[packages/framework/esm-globals/src/types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L93)

## Methods

### load

▸ **load**(): `Promise`<any\>

Defines a function to use for actually loading the component's lifecycle.

#### Returns

`Promise`<any\>

#### Inherited from

[ExtensionComponentDefinition](extensioncomponentdefinition.md).[load](extensioncomponentdefinition.md#load)

#### Defined in

[packages/framework/esm-globals/src/types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
