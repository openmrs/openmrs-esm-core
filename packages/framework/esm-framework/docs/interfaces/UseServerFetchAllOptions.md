[O3 Framework](../API.md) / UseServerFetchAllOptions

# Interface: UseServerFetchAllOptions\<R\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts#L14)

## Extends

- [`UseServerInfiniteOptions`](UseServerInfiniteOptions.md)\<`R`\>

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

#### Inherited from

[`UseServerInfiniteOptions`](UseServerInfiniteOptions.md).[`fetcher`](UseServerInfiniteOptions.md#fetcher)

***

### immutable?

> `optional` **immutable**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L26)

If true, sets these options in swrInfintieConfig to false:
revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`

#### Inherited from

[`UseServerInfiniteOptions`](UseServerInfiniteOptions.md).[`immutable`](UseServerInfiniteOptions.md#immutable)

***

### partialData?

> `optional` **partialData**: `boolean`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts#L21)

If true, the data of any page is returned as soon as they are fetched.
This is useful when you want to display data as soon as possible, even if not all pages are fetched.
If false, the returned data will be undefined until all pages are fetched. This is useful when you want to
display all data at once or reduce the number of re-renders (to avoid confusing users).

***

### swrInfiniteConfig?

> `optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`\<`any`, `any`, `BareFetcher`\<`any`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/85cde3ce59cd3d29230c98040a3f53525e808725/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L28)

#### Inherited from

[`UseServerInfiniteOptions`](UseServerInfiniteOptions.md).[`swrInfiniteConfig`](UseServerInfiniteOptions.md#swrinfiniteconfig)
