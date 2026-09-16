[O3 Framework](../API.md) / UseServerInfiniteOptions

# Interface: UseServerInfiniteOptions\<R\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:11](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L11)

## Extended by

- [`UseServerFetchAllOptions`](UseServerFetchAllOptions.md)

## Type Parameters

### R

`R`

## Properties

### fetcher()?

> `optional` **fetcher**: (`key`) => `Promise`\<[`FetchResponse`](FetchResponse.md)\<`R`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L15)

The fetcher to use. Defaults to openmrsFetch

#### Parameters

##### key

`string`

#### Returns

`Promise`\<[`FetchResponse`](FetchResponse.md)\<`R`\>\>

***

### immutable?

> `optional` **immutable**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:22](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L22)

If true, sets these options in swrInfintieConfig to false:
revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`

***

### swrInfiniteConfig?

> `optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`\<`any`, `any`, `BareFetcher`\<`any`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L24)
