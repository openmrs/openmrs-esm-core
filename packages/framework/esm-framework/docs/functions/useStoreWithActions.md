[O3 Framework](../API.md) / useStoreWithActions

# Function: useStoreWithActions()

> **useStoreWithActions**\<`T`, `A`\>(`store`, `actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:96](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L96)

## Type Parameters

### T

`T`

### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<`T`\>

## Parameters

### store

`StoreApi`\<`T`\>

A zustand store

### actions

`A`

## Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>
