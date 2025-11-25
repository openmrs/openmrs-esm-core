[O3 Framework](../API.md) / subscribeTo

# Function: subscribeTo()

## Call Signature

> **subscribeTo**\<`T`, `U`\>(`store`, `handle`): () => `void`

Defined in: [packages/framework/esm-state/src/state.ts:114](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L114)

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

Defined in: [packages/framework/esm-state/src/state.ts:115](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L115)

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
