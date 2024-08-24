[@openmrs/esm-framework](../API.md) / UseServerPaginationOptions

# Interface: UseServerPaginationOptions<R\>

## Type parameters

| Name |
| :------ |
| `R` |

## Table of contents

### UI Properties

- [immutable](UseServerPaginationOptions.md#immutable)
- [swrConfig](UseServerPaginationOptions.md#swrconfig)

### UI Methods

- [fetcher](UseServerPaginationOptions.md#fetcher)

## UI Properties

### immutable

• `Optional` **immutable**: `boolean`

Whether to use useSWR or useSWRInfinite to fetch data

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L17)

___

### swrConfig

• `Optional` **swrConfig**: `Partial`<`PublicConfiguration`<`any`, `any`, `BareFetcher`<`any`\>\>\>

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L24)

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

[packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L22)
