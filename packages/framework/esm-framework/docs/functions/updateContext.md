[O3 Framework](../API.md) / updateContext

# Function: updateContext()

> **updateContext**\<`T`\>(`namespace`, `update`): `void`

Defined in: [packages/framework/esm-context/src/context.ts:88](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-context/src/context.ts#L88)

Updates a namespace in the global context. If the namespace does not exist, it is registered.

## Type Parameters

### T

`T` *extends* `Record`\<`string` \| `number` \| `symbol`, `unknown`\> = `Record`\<`string` \| `number` \| `symbol`, `any`\>

## Parameters

### namespace

`string`

### update

(`state`) => `T`

## Returns

`void`
