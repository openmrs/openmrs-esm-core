[O3 Framework](../API.md) / createGlobalStore

# Function: createGlobalStore()

> **createGlobalStore**\<`T`\>(`name`, `initialState`): `StoreApi`\<`T`\>

Defined in: [packages/framework/esm-state/src/state.ts:31](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L31)

Creates a Zustand store.

## Type Parameters

### T

`T`

## Parameters

### name

`string`

A name by which the store can be looked up later.
   Must be unique across the entire application.

### initialState

`T`

An object which will be the initial state of the store.

## Returns

`StoreApi`\<`T`\>

The newly created store.
