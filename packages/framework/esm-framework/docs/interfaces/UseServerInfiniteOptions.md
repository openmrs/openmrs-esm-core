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

- [immutable](UseServerInfiniteOptions.md#immutable)
- [swrInfiniteConfig](UseServerInfiniteOptions.md#swrinfiniteconfig)

### UI Methods

- [fetcher](UseServerInfiniteOptions.md#fetcher)

## UI Properties

### immutable

• `Optional` **immutable**: `boolean`

If true, sets these options in swrInfintieConfig to false:
revalidateIfStale, revalidateOnFocus, revalidateOnReconnect
This should be the counterpart of using useSWRImmutable` for `useSWRInfinite`

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:26](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L26)

___

### swrInfiniteConfig

• `Optional` **swrInfiniteConfig**: `SWRInfiniteConfiguration`<`any`, `any`, `BareFetcher`<`any`\>\>

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

#### Defined in

[packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L19)
