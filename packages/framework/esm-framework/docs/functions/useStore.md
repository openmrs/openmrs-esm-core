[O3 Framework](../API.md) / useStore

# Function: useStore()

## Call Signature

> **useStore**\<`T`\>(`store`): `T`

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:52](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L52)

### Type Parameters

#### T

`T`

### Parameters

#### store

`StoreApi`\<`T`\>

### Returns

`T`

## Call Signature

> **useStore**\<`T`, `U`\>(`store`, `select`): `U`

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:53](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L53)

### Type Parameters

#### T

`T`

#### U

`U`

### Parameters

#### store

`StoreApi`\<`T`\>

#### select

(`state`) => `U`

### Returns

`U`

## Call Signature

> **useStore**\<`T`, `U`, `A`\>(`store`, `select`, `actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:54](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L54)

### Type Parameters

#### T

`T`

#### U

`U`

#### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<`T`\>

### Parameters

#### store

`StoreApi`\<`T`\>

#### select

`undefined`

#### actions

`A`

### Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

## Call Signature

> **useStore**\<`T`, `U`, `A`\>(`store`, `select`, `actions`): `U` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L59)

### Type Parameters

#### T

`T`

#### U

`U`

#### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<`T`\>

### Parameters

#### store

`StoreApi`\<`T`\>

#### select

(`state`) => `U`

#### actions

`A`

### Returns

`U` & [`BoundActions`](../type-aliases/BoundActions.md)\<`T`, `A`\>
