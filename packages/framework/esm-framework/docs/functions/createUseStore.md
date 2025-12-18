[O3 Framework](../API.md) / createUseStore

# Function: createUseStore()

> **createUseStore**\<`T`\>(`store`): \{(): `T`; \<`A`\>(`actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>; \<`A`\>(`actions?`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>; \}

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L104)

Whenever possible, use `useStore(yourStore)` instead. This function is for creating a
custom hook for a specific store.

## Type Parameters

### T

`T`

## Parameters

### store

`StoreApi`\<`T`\>

## Returns

> (): `T`

### Returns

`T`

> \<`A`\>(`actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

### Type Parameters

#### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<`T`\>

### Parameters

#### actions

`A`

### Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

> \<`A`\>(`actions?`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

### Type Parameters

#### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<`T`\>

### Parameters

#### actions?

`A`

### Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>
