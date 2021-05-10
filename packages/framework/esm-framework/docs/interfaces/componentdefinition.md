[@openmrs/esm-framework](../API.md) / ComponentDefinition

# Interface: ComponentDefinition

## Hierarchy

- **ComponentDefinition**

  ↳ [*ModernAppExtensionDefinition*](modernappextensiondefinition.md)

  ↳ [*LegacyAppExtensionDefinition*](legacyappextensiondefinition.md)

  ↳ [*PageDefinition*](pagedefinition.md)

## Table of contents

### Properties

- [offline](componentdefinition.md#offline)
- [online](componentdefinition.md#online)
- [resources](componentdefinition.md#resources)

### Methods

- [load](componentdefinition.md#load)

## Properties

### offline

• `Optional` **offline**: *boolean* \| *object*

Defines the offline support / properties of the component.

Defined in: [packages/framework/esm-globals/src/types.ts:88](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L88)

___

### online

• `Optional` **online**: *boolean* \| *object*

Defines the online support / properties of the component.

Defined in: [packages/framework/esm-globals/src/types.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L84)

___

### resources

• `Optional` **resources**: *Record*<string, [*ResourceLoader*](resourceloader.md)<any\>\>

Defines resources that are loaded when the component should mount.

Defined in: [packages/framework/esm-globals/src/types.ts:92](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L92)

## Methods

### load

▸ **load**(): *Promise*<any\>

Defines a function to use for actually loading the component's lifecycle.

**Returns:** *Promise*<any\>

Defined in: [packages/framework/esm-globals/src/types.ts:80](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-globals/src/types.ts#L80)
