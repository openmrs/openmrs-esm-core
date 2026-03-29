[O3 Framework](../API.md) / useExtensionStore

# Variable: useExtensionStore()

> `const` **useExtensionStore**: \{(): [`ExtensionStore`](../interfaces/ExtensionStore.md); \<`A`\>(`actions`): [`ExtensionStore`](../interfaces/ExtensionStore.md) & [`BoundActions`](../type-aliases/BoundActions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md), `A`\>; \<`A`\>(`actions?`): [`ExtensionStore`](../interfaces/ExtensionStore.md) & [`BoundActions`](../type-aliases/BoundActions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md), `A`\>; \}

Defined in: [packages/framework/esm-react-utils/src/useExtensionStore.ts:5](https://github.com/sarvani-701/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useExtensionStore.ts#L5)

## Call Signature

> (): [`ExtensionStore`](../interfaces/ExtensionStore.md)

### Returns

[`ExtensionStore`](../interfaces/ExtensionStore.md)

## Call Signature

> \<`A`\>(`actions`): [`ExtensionStore`](../interfaces/ExtensionStore.md) & [`BoundActions`](../type-aliases/BoundActions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md), `A`\>

### Type Parameters

#### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md)\>

### Parameters

#### actions

`A`

### Returns

[`ExtensionStore`](../interfaces/ExtensionStore.md) & [`BoundActions`](../type-aliases/BoundActions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md), `A`\>

## Call Signature

> \<`A`\>(`actions?`): [`ExtensionStore`](../interfaces/ExtensionStore.md) & [`BoundActions`](../type-aliases/BoundActions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md), `A`\>

### Type Parameters

#### A

`A` *extends* [`Actions`](../type-aliases/Actions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md)\>

### Parameters

#### actions?

`A`

### Returns

[`ExtensionStore`](../interfaces/ExtensionStore.md) & [`BoundActions`](../type-aliases/BoundActions.md)\<[`ExtensionStore`](../interfaces/ExtensionStore.md), `A`\>
