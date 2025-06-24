[O3 Framework](../API.md) / getAsyncExtensionLifecycle

# Variable: ~~getAsyncExtensionLifecycle()~~

> `const` **getAsyncExtensionLifecycle**: \<`T`\>(`lazy`, `options`) => () => `Promise`\<`ReactAppOrParcel`\<`T`\>\> = `getAsyncLifecycle`

Defined in: [packages/framework/esm-react-utils/src/getLifecycle.ts:32](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-react-utils/src/getLifecycle.ts#L32)

## Type Parameters

### T

`T`

## Parameters

### lazy

() => `Promise`\<\{ `default`: `ComponentType`\<`T`\>; \}\>

### options

`ComponentDecoratorOptions`

## Returns

> (): `Promise`\<`ReactAppOrParcel`\<`T`\>\>

### Returns

`Promise`\<`ReactAppOrParcel`\<`T`\>\>

## Deprecated

Use getAsyncLifecycle instead.
