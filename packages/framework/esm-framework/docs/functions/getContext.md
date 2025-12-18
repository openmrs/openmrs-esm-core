[O3 Framework](../API.md) / getContext

# Function: getContext()

> **getContext**\<`T`\>(`namespace`): `null` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-context/src/context.ts:63](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-context/src/context.ts#L63)

Returns an _immutable_ version of the state of the namespace as it is currently

## Type Parameters

### T

`T` *extends* `object` = `object`

The type of the value stored in the namespace

## Parameters

### namespace

`string`

The namespace to load properties from

## Returns

`null` \| `Readonly`\<`T`\>
