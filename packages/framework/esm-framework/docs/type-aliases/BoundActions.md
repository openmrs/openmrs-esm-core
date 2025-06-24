[O3 Framework](../API.md) / BoundActions

# Type Alias: BoundActions\<T, A\>

> **BoundActions**\<`T`, `A`\> = `A` *extends* `ActionFunctionsRecord`\<`T`\> ? `BindFunctionsIn`\<`A`\> : `A` *extends* (`store`) => `ActionFunctionsRecord`\<`T`\> ? `BindFunctionsIn`\<`ActionFunctionsRecord`\<`T`\>\> : `never`

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:12](https://github.com/openmrs/openmrs-esm-core/blob/18d2874f03a33a6ab8295af0e87ac97fdd150718/packages/framework/esm-react-utils/src/useStore.ts#L12)

## Type Parameters

### T

`T`

### A

`A` *extends* [`Actions`](Actions.md)\<`T`\>
