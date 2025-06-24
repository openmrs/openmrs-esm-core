[O3 Framework](../API.md) / subscribeToContext

# Function: subscribeToContext()

> **subscribeToContext**\<`T`\>(`namespace`, `callback`): () => `void`

Defined in: [packages/framework/esm-context/src/context.ts:104](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-context/src/context.ts#L104)

Subscribes to updates of a given namespace. Note that the returned object is immutable.

## Type Parameters

### T

`T` *extends* `object` = \{ \}

## Parameters

### namespace

`string`

the namespace to subscribe to

### callback

[`ContextCallback`](../type-aliases/ContextCallback.md)\<`T`\>

a function invoked with the current context whenever

## Returns

A function to unsubscribe from the context

> (): `void`

### Returns

`void`
