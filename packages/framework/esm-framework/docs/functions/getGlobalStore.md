[O3 Framework](../API.md) / getGlobalStore

# Function: getGlobalStore()

> **getGlobalStore**\<`T`\>(`name`, `fallbackState?`): `StoreApi`\<`T`\>

Defined in: [packages/framework/esm-state/src/state.ts:92](https://github.com/its-kios09/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L92)

Returns the existing store named `name`,
or creates a new store named `name` if none exists.

## Type Parameters

### T

`T`

## Parameters

### name

`string`

The name of the store to look up.

### fallbackState?

`T`

The initial value of the new store if no store named `name` exists.

## Returns

`StoreApi`\<`T`\>

The found or newly created store.
