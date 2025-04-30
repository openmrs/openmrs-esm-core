[O3 Framework](../API.md) / useStore

# Function: useStore()

## Call Signature

> **useStore**\<`T`, `U`\>(`store`): `T`

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:35](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useStore.ts#L35)

### Type Parameters

#### T

`T`

#### U

`U`

### Parameters

#### store

`StoreApi`\<`T`\>

### Returns

`T`

## Call Signature

> **useStore**\<`T`, `U`\>(`store`, `select`): `U`

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:36](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useStore.ts#L36)

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

> **useStore**\<`T`, `U`\>(`store`, `select`, `actions`): `T` & [`BoundActions`](../type-aliases/BoundActions.md)

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:37](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useStore.ts#L37)

### Type Parameters

#### T

`T`

#### U

`U`

### Parameters

#### store

`StoreApi`\<`T`\>

#### select

`undefined`

#### actions

[`Actions`](../type-aliases/Actions.md)\<`T`\>

### Returns

`T` & [`BoundActions`](../type-aliases/BoundActions.md)

## Call Signature

> **useStore**\<`T`, `U`\>(`store`, `select`, `actions`): `U` & [`BoundActions`](../type-aliases/BoundActions.md)

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:38](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useStore.ts#L38)

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

#### actions

[`Actions`](../type-aliases/Actions.md)\<`T`\>

### Returns

`U` & [`BoundActions`](../type-aliases/BoundActions.md)
