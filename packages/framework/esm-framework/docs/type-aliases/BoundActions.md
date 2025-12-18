[O3 Framework](../API.md) / BoundActions

# Type Alias: BoundActions\<T, A\>

> **BoundActions**\<`T`, `A`\> = `A` *extends* `ActionFunctionsRecord`\<`T`\> ? `BindFunctionsIn`\<`A`\> : `A` *extends* (`store`) => `ActionFunctionsRecord`\<`T`\> ? `BindFunctionsIn`\<`ActionFunctionsRecord`\<`T`\>\> : `never`

Defined in: [packages/framework/esm-react-utils/src/useStore.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useStore.ts#L11)

## Type Parameters

### T

`T`

### A

`A` *extends* [`Actions`](Actions.md)\<`T`\>
