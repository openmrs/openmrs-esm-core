[@openmrs/esm-framework](../API.md) / ModernAppExtensionDefinition

# Interface: ModernAppExtensionDefinition

## Hierarchy

- [*ComponentDefinition*](componentdefinition.md)

  ↳ **ModernAppExtensionDefinition**

## Table of contents

### Properties

- [id](modernappextensiondefinition.md#id)
- [meta](modernappextensiondefinition.md#meta)
- [offline](modernappextensiondefinition.md#offline)
- [online](modernappextensiondefinition.md#online)
- [resources](modernappextensiondefinition.md#resources)
- [slot](modernappextensiondefinition.md#slot)
- [slots](modernappextensiondefinition.md#slots)

### Methods

- [load](modernappextensiondefinition.md#load)

## Properties

### id

• **id**: *string*

The ID of the extension to register.

Defined in: [packages/framework/esm-globals/src/types.ts:100](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L100)

___

### meta

• `Optional` **meta**: *Record*<string, any\>

The meta data used for reflection by other components.

Defined in: [packages/framework/esm-globals/src/types.ts:112](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L112)

___

### offline

• `Optional` **offline**: *boolean* \| *object*

Defines the offline support / properties of the component.

Inherited from: [ComponentDefinition](componentdefinition.md).[offline](componentdefinition.md#offline)

Defined in: [packages/framework/esm-globals/src/types.ts:89](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L89)

___

### online

• `Optional` **online**: *boolean* \| *object*

Defines the online support / properties of the component.

Inherited from: [ComponentDefinition](componentdefinition.md).[online](componentdefinition.md#online)

Defined in: [packages/framework/esm-globals/src/types.ts:85](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L85)

___

### resources

• `Optional` **resources**: *Record*<string, [*ResourceLoader*](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

Inherited from: [ComponentDefinition](componentdefinition.md).[resources](componentdefinition.md#resources)

Defined in: [packages/framework/esm-globals/src/types.ts:93](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L93)

___

### slot

• `Optional` **slot**: *string*

The slot of the extension to optionally attach to.

Defined in: [packages/framework/esm-globals/src/types.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L104)

___

### slots

• `Optional` **slots**: *string*[]

The slots of the extension to optionally attach to.

Defined in: [packages/framework/esm-globals/src/types.ts:108](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L108)

## Methods

### load

▸ **load**(): *Promise*<any\>

Defines a function to use for actually loading the component's lifecycle.

**Returns:** *Promise*<any\>

Inherited from: [ComponentDefinition](componentdefinition.md)

Defined in: [packages/framework/esm-globals/src/types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
