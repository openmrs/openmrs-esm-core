[@openmrs/esm-globals](../API.md) / ExtensionComponentDefinition

# Interface: ExtensionComponentDefinition

## Hierarchy

- [*ComponentDefinition*](componentdefinition.md)

  ↳ **ExtensionComponentDefinition**

  ↳↳ [*ModernAppExtensionDefinition*](modernappextensiondefinition.md)

  ↳↳ [*LegacyAppExtensionDefinition*](legacyappextensiondefinition.md)

## Table of contents

### Properties

- [meta](extensioncomponentdefinition.md#meta)
- [offline](extensioncomponentdefinition.md#offline)
- [online](extensioncomponentdefinition.md#online)
- [order](extensioncomponentdefinition.md#order)
- [resources](extensioncomponentdefinition.md#resources)

### Methods

- [load](extensioncomponentdefinition.md#load)

## Properties

### meta

• `Optional` **meta**: *Record*<string, any\>

The meta data used for reflection by other components.

Defined in: [types.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L100)

___

### offline

• `Optional` **offline**: *boolean* \| *object*

Defines the offline support / properties of the component.

Inherited from: [ComponentDefinition](componentdefinition.md).[offline](componentdefinition.md#offline)

Defined in: [types.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L89)

___

### online

• `Optional` **online**: *boolean* \| *object*

Defines the online support / properties of the component.

Inherited from: [ComponentDefinition](componentdefinition.md).[online](componentdefinition.md#online)

Defined in: [types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L85)

___

### order

• `Optional` **order**: *number*

Specifies a preferred order number, if any.

Defined in: [types.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L104)

___

### resources

• `Optional` **resources**: *Record*<string, [*ResourceLoader*](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

Inherited from: [ComponentDefinition](componentdefinition.md).[resources](componentdefinition.md#resources)

Defined in: [types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L93)

## Methods

### load

▸ **load**(): *Promise*<any\>

Defines a function to use for actually loading the component's lifecycle.

**Returns:** *Promise*<any\>

Inherited from: [ComponentDefinition](componentdefinition.md)

Defined in: [types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
