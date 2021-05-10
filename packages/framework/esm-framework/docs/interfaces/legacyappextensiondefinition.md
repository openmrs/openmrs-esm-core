[@openmrs/esm-framework](../API.md) / LegacyAppExtensionDefinition

# Interface: LegacyAppExtensionDefinition

## Hierarchy

- [*ComponentDefinition*](componentdefinition.md)

  ↳ **LegacyAppExtensionDefinition**

## Table of contents

### Properties

- [meta](legacyappextensiondefinition.md#meta)
- [name](legacyappextensiondefinition.md#name)
- [offline](legacyappextensiondefinition.md#offline)
- [online](legacyappextensiondefinition.md#online)
- [resources](legacyappextensiondefinition.md#resources)

### Methods

- [load](legacyappextensiondefinition.md#load)

## Properties

### meta

• `Optional` **meta**: *Record*<string, any\>

The meta data used for reflection by other components.

Defined in: [packages/framework/esm-globals/src/types.ts:123](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L123)

___

### name

• **name**: *string*

The ID of the extension to register.

Defined in: [packages/framework/esm-globals/src/types.ts:119](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L119)

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

## Methods

### load

▸ **load**(): *Promise*<any\>

Defines a function to use for actually loading the component's lifecycle.

**Returns:** *Promise*<any\>

Inherited from: [ComponentDefinition](componentdefinition.md)

Defined in: [packages/framework/esm-globals/src/types.ts:81](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L81)
