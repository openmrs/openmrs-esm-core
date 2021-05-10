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

Defined in: [packages/framework/esm-globals/src/types.ts:122](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L122)

___

### name

• **name**: *string*

The ID of the extension to register.

Defined in: [packages/framework/esm-globals/src/types.ts:118](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L118)

___

### offline

• `Optional` **offline**: *boolean* \| *object*

Defines the offline support / properties of the component.

Inherited from: [ComponentDefinition](componentdefinition.md).[offline](componentdefinition.md#offline)

Defined in: [packages/framework/esm-globals/src/types.ts:88](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L88)

___

### online

• `Optional` **online**: *boolean* \| *object*

Defines the online support / properties of the component.

Inherited from: [ComponentDefinition](componentdefinition.md).[online](componentdefinition.md#online)

Defined in: [packages/framework/esm-globals/src/types.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L84)

___

### resources

• `Optional` **resources**: *Record*<string, [*ResourceLoader*](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

Inherited from: [ComponentDefinition](componentdefinition.md).[resources](componentdefinition.md#resources)

Defined in: [packages/framework/esm-globals/src/types.ts:92](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L92)

## Methods

### load

▸ **load**(): *Promise*<any\>

Defines a function to use for actually loading the component's lifecycle.

**Returns:** *Promise*<any\>

Inherited from: [ComponentDefinition](componentdefinition.md)

Defined in: [packages/framework/esm-globals/src/types.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L80)
