[O3 Framework](../API.md) / useFhirPagination

# Function: useFhirPagination()

> **useFhirPagination**\<`T`\>(`url`, `pageSize`, `options`): `object`

Defined in: [packages/framework/esm-react-utils/src/useFhirPagination.ts:27](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useFhirPagination.ts#L27)

Fhir REST endpoints that return a list of objects, are server-side paginated.
The server limits the max number of results being returned, and multiple requests are needed to get the full data set
if its size exceeds this limit.

This function is the FHIR counterpart of `useOpenmrsPagination`.

## Type Parameters

### T

`T` *extends* `ResourceBase`

## Parameters

### url

The URL of the paginated rest endpoint.
           which will be overridden and manipulated by the `goTo*` callbacks

`string` | `URL`

### pageSize

`number`

The number of results to return per page / fetch.

### options

[`UseServerPaginationOptions`](../interfaces/UseServerPaginationOptions.md)\<`Bundle`\> = `{}`

The options object

## Returns

### currentPage

> **currentPage**: `number`

### currentPageSize

> **currentPageSize**: `MutableRefObject`\<`number`\>

### data

> **data**: `undefined` \| `T`[]

### error

> **error**: `any`

The error object thrown by the fetcher function.

### goTo()

> **goTo**: (`page`) => `void`

#### Parameters

##### page

`number`

#### Returns

`void`

### goToNext()

> **goToNext**: () => `void`

#### Returns

`void`

### goToPrevious()

> **goToPrevious**: () => `void`

#### Returns

`void`

### isLoading

> **isLoading**: `boolean`

### isValidating

> **isValidating**: `boolean`

### mutate

> **mutate**: `KeyedMutator`\<`FetchResponse`\<`Bundle`\>\>

### paginated

> **paginated**: `boolean`

### showNextButton

> **showNextButton**: `boolean`

### showPreviousButton

> **showPreviousButton**: `boolean`

### totalCount

> **totalCount**: `number` = `totalCount.current`

### totalPages

> **totalPages**: `number`

## See

`useOpenmrsPagination
@see `useFhirInfinite`
@see `useFhirFetchAll`
@see `usePagination` for pagination of client-side data`
