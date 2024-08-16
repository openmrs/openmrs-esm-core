[@openmrs/esm-framework](../API.md) / UseServerInfiniteReturnObject

# Interface: UseServerInfiniteReturnObject<T\>

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### UI Properties

- [data](UseServerInfiniteReturnObject.md#data)
- [error](UseServerInfiniteReturnObject.md#error)
- [hasMore](UseServerInfiniteReturnObject.md#hasmore)
- [isLoading](UseServerInfiniteReturnObject.md#isloading)
- [isValidating](UseServerInfiniteReturnObject.md#isvalidating)
- [mutate](UseServerInfiniteReturnObject.md#mutate)
- [totalCount](UseServerInfiniteReturnObject.md#totalcount)

### UI Methods

- [loadMore](UseServerInfiniteReturnObject.md#loadmore)

## UI Properties

### data

• **data**: `undefined` \| `T`[]

The data fetched from the server so far. Note that this array contains
the aggregate of data from all fetched pages. Unless hasMore == false,
this array does not contain the complete data set.

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:14](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L14)

___

### error

• **error**: `any`

from useSWRInfinite

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:34](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L34)

___

### hasMore

• **hasMore**: `boolean`

Whether there are more results in the data set that have not been fetched yet.

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L24)

___

### isLoading

• **isLoading**: `boolean`

from useSWRInfinite

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L49)

___

### isValidating

• **isValidating**: `boolean`

from useSWRInfinite

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:44](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L44)

___

### mutate

• **mutate**: `KeyedMutator`<[`FetchResponse`](FetchResponse.md)<[`OpenMRSPaginatedResponse`](OpenMRSPaginatedResponse.md)<`T`\>\>[]\>

from useSWRInfinite

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:39](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L39)

___

### totalCount

• **totalCount**: `undefined` \| `number`

The total number of rows in the data set.

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L19)

## UI Methods

### loadMore

▸ **loadMore**(): `void`

callback function to make another fetch of next page's data set.

#### Returns

`void`

#### Defined in

[packages/framework/esm-react-utils/src/useServerInfinite.ts:29](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useServerInfinite.ts#L29)
