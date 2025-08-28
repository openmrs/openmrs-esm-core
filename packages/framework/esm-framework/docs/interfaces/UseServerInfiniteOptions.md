[O3 Framework](../API.md) / UseServerInfiniteOptions

# Interface: UseServerInfiniteOptions\<R\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L14)

## Extended by

- [`UseServerFetchAllOptions`](UseServerFetchAllOptions.md)

## Type Parameters

### R

`R`

## Properties

### fetcher()?

> `optional` **fetcher**: (`key`) => `Promise`\<`FetchResponse`\<`R`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:18](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L18)

The fetcher to use. Defaults to openmrsFetch

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`FetchResponse`\<`R`\>\>

***

### immutable?

> `optional` **immutable**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:25](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L25)

If true, sets these options in swrInfintieConfig to false:
revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`

***

### swrInfiniteConfig?

> `optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`\<`any`, `any`, `BareFetcher`\<`any`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L27)
