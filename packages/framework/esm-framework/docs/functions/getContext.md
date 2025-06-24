[O3 Framework](../API.md) / getContext

# Function: getContext()

> **getContext**\<`T`\>(`namespace`): `null` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-context/src/context.ts:60](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-context/src/context.ts#L60)

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
