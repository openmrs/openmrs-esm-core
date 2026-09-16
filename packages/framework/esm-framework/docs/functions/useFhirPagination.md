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

> **currentPageSize**: `number` = `currentPageSize.current`

### data

> **data**: `undefined` \| `T`[]

### error

> **error**: `any`

The error object thrown by the fetcher function.

`undefined` when there's no error or when a request is in progress.

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

Whether the request is in initial loading state.

`true` only during the initial load when there's no cached data.
Unlike `isValidating`, this becomes `false` once data is available.

### isValidating

> **isValidating**: `boolean`

Whether the request is currently being validated (loading fresh data).

`true` during initial load, revalidation, or when mutate is called
with a promise or async function.

### mutate

> **mutate**: `KeyedMutator`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`Bundle`\>\>

Function to mutate the cached data for this specific key.

This is a bound version of the global mutate function that automatically
uses the current key, providing type safety and convenience.

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
