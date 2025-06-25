[O3 Framework](../API.md) / getContext

# Function: getContext()

> **getContext**\<`T`\>(`namespace`): `null` \| `Readonly`\<`T`\>

Defined in: [packages/framework/esm-context/src/context.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-context/src/context.ts#L62)

Returns an _immutable_ version of the state of the namespace as it is currently

## Type Parameters

### T

`T` *extends* `Record`\<`string` \| `number` \| `symbol`, `unknown`\> = `Record`\<`string` \| `number` \| `symbol`, `any`\>

The type of the value stored in the namespace

## Parameters

### namespace

`string`

The namespace to load properties from

## Returns

`null` \| `Readonly`\<`T`\>
