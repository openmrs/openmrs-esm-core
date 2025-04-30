[O3 Framework](../API.md) / createUseStore

# Function: createUseStore()

> **createUseStore**\<`T`\>(`store`): \{(): `T`; (`actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md); (`actions?`): `T` & [`BoundActions`](../type-aliases/BoundActions.md); \}

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:62](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useStore.ts#L62)

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

> (`actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)

### Parameters

#### actions

[`Actions`](../type-aliases/Actions.md)\<`T`\>

### Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)

> (`actions?`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)

### Parameters

#### actions?

[`Actions`](../type-aliases/Actions.md)\<`T`\>

### Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)
