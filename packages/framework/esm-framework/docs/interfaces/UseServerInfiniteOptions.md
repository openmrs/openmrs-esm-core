[O3 Framework](../API.md) / UseServerInfiniteOptions

# Interface: UseServerInfiniteOptions\<R\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L15)

## Extended by

- [`UseServerFetchAllOptions`](UseServerFetchAllOptions.md)

## Type Parameters

### R

`R`

## Properties

### fetcher()?

> `optional` **fetcher**: (`key`) => `Promise`\<`FetchResponse`\<`R`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L19)

The fetcher to use. Defaults to openmrsFetch

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`FetchResponse`\<`R`\>\>

***

### immutable?

> `optional` **immutable**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L26)

If true, sets these options in swrInfintieConfig to false:
revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`

***

### swrInfiniteConfig?

> `optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`\<`any`, `any`, `BareFetcher`\<`any`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L28)
