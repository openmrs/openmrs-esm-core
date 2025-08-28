[O3 Framework](../API.md) / subscribeTo

# Function: subscribeTo()

## Call Signature

> **subscribeTo**\<`T`, `U`\>(`store`, `handle`): () => `void`

Defined in: [packages/framework/esm-state/src/state.ts:109](https://github.com/its-kios09/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L109)

### Type Parameters

#### T

`T`

#### U

`U` = `T`

### Parameters

#### store

`StoreApi`\<`T`\>

#### handle

(`state`) => `void`

### Returns

> (): `void`

#### Returns

`void`

## Call Signature

> **subscribeTo**\<`T`, `U`\>(`store`, `select`, `handle`): () => `void`

Defined in: [packages/framework/esm-state/src/state.ts:110](https://github.com/its-kios09/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L110)

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

#### handle

(`subState`) => `void`

### Returns

> (): `void`

#### Returns

`void`
