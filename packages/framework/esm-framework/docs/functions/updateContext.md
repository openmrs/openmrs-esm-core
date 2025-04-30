[O3 Framework](../API.md) / updateContext

# Function: updateContext()

> **updateContext**\<`T`\>(`namespace`, `update`): `void`

Defined in: [packages/framework/esm-context/src/context.ts:84](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-context/src/context.ts#L84)

Updates a namespace in the global context. If the namespace does not exist, it is registered.

## Type Parameters

### T

`T` *extends* `object` = \{ \}

## Parameters

### namespace

`string`

### update

(`state`) => `T`

## Returns

`void`
