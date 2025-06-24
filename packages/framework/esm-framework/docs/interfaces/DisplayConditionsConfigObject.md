[@openmrs/esm-framework](../API.md) / DisplayConditionsConfigObject

# Interface: DisplayConditionsConfigObject

## Table of contents

### Properties

- [expression](DisplayConditionsConfigObject.md#expression)
- [offline](DisplayConditionsConfigObject.md#offline)
- [online](DisplayConditionsConfigObject.md#online)
- [privileges](DisplayConditionsConfigObject.md#privileges)

## Properties

### expression

• `Optional` **expression**: `string`

An expression to evaluate whether or not the user should see this extension

#### Defined in

[packages/framework/esm-config/src/types.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L39)

___

### offline

• `Optional` **offline**: `boolean`

Whether to display this extension when not connected to the server

#### Defined in

[packages/framework/esm-config/src/types.ts:43](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L43)

___

### online

• `Optional` **online**: `boolean`

Whether to display this extension when connected to the server

#### Defined in

[packages/framework/esm-config/src/types.ts:41](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L41)

___

### privileges

• `Optional` **privileges**: `string`[]

The privileges a user should have to see this extension

#### Defined in

[packages/framework/esm-config/src/types.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-config/src/types.ts#L37)
