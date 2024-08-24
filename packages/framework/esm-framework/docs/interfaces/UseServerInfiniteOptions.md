[@openmrs/esm-framework](../API.md) / UseServerInfiniteOptions

# Interface: UseServerInfiniteOptions<R\>

## Type parameters

| Name |
| :------ |
| `R` |

## Hierarchy

- **`UseServerInfiniteOptions`**

  ↳ [`UseServerFetchAllOptions`](UseServerFetchAllOptions.md)

## Table of contents

### UI Properties

- [swrInfiniteConfig](UseServerInfiniteOptions.md#swrinfiniteconfig)

### UI Methods

- [fetcher](UseServerInfiniteOptions.md#fetcher)

## UI Properties

### swrInfiniteConfig

• `Optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`<`any`, `any`, `BareFetcher`<`any`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L21)

## UI Methods

### fetcher

▸ `Optional` **fetcher**(`key`): `Promise`<[`FetchResponse`](FetchResponse.md)<`R`\>\>

The fetcher to use. Defaults to openmrsFetch

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<[`FetchResponse`](FetchResponse.md)<`R`\>\>

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L19)
