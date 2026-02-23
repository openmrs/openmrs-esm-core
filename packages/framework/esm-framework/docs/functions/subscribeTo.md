[O3 Framework](../API.md) / subscribeTo

# Function: subscribeTo()

## Call Signature

> **subscribeTo**\<`T`, `U`\>(`store`, `handle`): () => `void`

Defined in: [packages/framework/esm-state/src/state.ts:128](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L128)

Subscribes to a store and invokes a callback when the state changes.
The callback is also immediately invoked with the current state upon subscription.
Uses shallow equality comparison to determine if the state has changed.

This function has two overloads:
1. Subscribe to the entire store state
2. Subscribe to a selected portion of the state using a selector function

### Type Parameters

#### T

`T`

#### U

`U` = `T`

### Parameters

#### store

`StoreApi`\<`T`\>

The store to subscribe to.

#### handle

(`state`) => `void`

A callback function that receives the state (or selected state) when it changes.

### Returns

An unsubscribe function to stop listening for changes.

> (): `void`

#### Returns

`void`

## Call Signature

> **subscribeTo**\<`T`, `U`\>(`store`, `select`, `handle`): () => `void`

Defined in: [packages/framework/esm-state/src/state.ts:129](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-state/src/state.ts#L129)

Subscribes to a store and invokes a callback when the state changes.
The callback is also immediately invoked with the current state upon subscription.
Uses shallow equality comparison to determine if the state has changed.

This function has two overloads:
1. Subscribe to the entire store state
2. Subscribe to a selected portion of the state using a selector function

### Type Parameters

#### T

`T`

#### U

`U`

### Parameters

#### store

`StoreApi`\<`T`\>

The store to subscribe to.

#### select

(`state`) => `U`

#### handle

(`subState`) => `void`

A callback function that receives the state (or selected state) when it changes.

### Returns

An unsubscribe function to stop listening for changes.

> (): `void`

#### Returns

`void`
