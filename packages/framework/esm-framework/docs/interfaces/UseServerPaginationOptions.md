[O3 Framework](../API.md) / UseServerPaginationOptions

# Interface: UseServerPaginationOptions\<R\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:13](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L13)

## Type Parameters

### R

`R`

## Properties

### fetcher()?

> `optional` **fetcher**: (`key`) => `Promise`\<`FetchResponse`\<`R`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L22)

The fetcher to use. Defaults to openmrsFetch

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`FetchResponse`\<`R`\>\>

***

### immutable?

> `optional` **immutable**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:17](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L17)

Whether to use useSWR or useSWRInfinite to fetch data

***

### swrConfig?

> `optional` **swrConfig**: `SWRConfiguration`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L27)

The configuration object for useSWR or useSWRInfinite
