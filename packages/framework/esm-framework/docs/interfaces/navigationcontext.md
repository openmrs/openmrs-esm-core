[@openmrs/esm-framework](../API.md) / NavigationContext

# Interface: NavigationContext

## Table of contents

### Properties

- [type](navigationcontext.md#type)

### Methods

- [handler](navigationcontext.md#handler)

## Properties

### type

• **type**: [NavigationContextType](../API.md#navigationcontexttype)

#### Defined in

[packages/framework/esm-extensions/src/contexts.ts:6](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L6)

## Methods

### handler

▸ **handler**<T\>(`link`, `state`): `boolean`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `link` | `string` |
| `state` | `T` |

#### Returns

`boolean`

#### Defined in

[packages/framework/esm-extensions/src/contexts.ts:7](https://github.com/openmrs/openmrs-esm-core/blob/master/packages/framework/esm-extensions/src/contexts.ts#L7)
