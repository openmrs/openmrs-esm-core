[O3 Framework](../API.md) / getContext

# Function: getContext()

> **getContext**\<`T`\>(`namespace`): `null` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-context/src/context.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-context/src/context.ts#L60)

Returns an _immutable_ version of the state of the namespace as it is currently

## Type Parameters

### T

`T` *extends* `object` = \{ \}

The type of the value stored in the namespace

## Parameters

### namespace

`string`

The namespace to load properties from

## Returns

`null` \| `Readonly`\<`T`\>

## Type Param

The type of the value stored in the namespace

## Type Param

The return type of this hook which is mostly relevant when using a selector

## Param

The namespace to load properties from

## Param

An optional function which extracts the relevant part of the state
