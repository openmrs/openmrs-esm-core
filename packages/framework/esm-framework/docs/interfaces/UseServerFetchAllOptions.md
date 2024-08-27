[@openmrs/esm-framework](../API.md) / UseServerFetchAllOptions

# Interface: UseServerFetchAllOptions<R\>

## Type parameters

| Name |
| :------ |
| `R` |

## Hierarchy

- [`UseServerInfiniteOptions`](UseServerInfiniteOptions.md)<`R`\>

  ↳ **`UseServerFetchAllOptions`**

## Table of contents

### UI Properties

- [immutable](UseServerFetchAllOptions.md#immutable)
- [partialData](UseServerFetchAllOptions.md#partialdata)
- [swrInfiniteConfig](UseServerFetchAllOptions.md#swrinfiniteconfig)

### UI Methods

- [fetcher](UseServerFetchAllOptions.md#fetcher)

## UI Properties

### immutable

• `Optional` **immutable**: `boolean`

If true, sets these options in swrInfintieConfig to false:
revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`

#### Inherited from

[UseServerInfiniteOptions](UseServerInfiniteOptions.md).[immutable](UseServerInfiniteOptions.md#immutable)

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L26)

___

### partialData

• `Optional` **partialData**: `boolean`

If true, the data of any page as soon as they are fetched.
This is useful when you want to display data as soon as possible, even if not all pages are fetched.
If false, the returned data will be undefined until all pages are fetched. This is useful when you want to
display all data at once or reduce the number of re-renders (to avoid confusing users).

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts:21](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts#L21)

___

### swrInfiniteConfig

• `Optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`<`any`, `any`, `BareFetcher`<`any`\>\>

#### Inherited from

[UseServerInfiniteOptions](UseServerInfiniteOptions.md).[swrInfiniteConfig](UseServerInfiniteOptions.md#swrinfiniteconfig)

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:28](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L28)

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

#### Inherited from

[UseServerInfiniteOptions](UseServerInfiniteOptions.md).[fetcher](UseServerInfiniteOptions.md#fetcher)

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L19)
