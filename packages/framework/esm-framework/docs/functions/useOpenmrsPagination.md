[O3 Framework](../API.md) / useOpenmrsPagination

# Function: useOpenmrsPagination()

> **useOpenmrsPagination**\<`T`\>(`url`, `pageSize`, `options`): `object`

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsPagination.ts:59](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsPagination.ts#L59)

Most OpenMRS REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
The server limits the max number of results being returned, and multiple requests are needed to get the full data set
if its size exceeds this limit.
The max number of results per request is configurable server-side
with the key "webservices.rest.maxResultsDefault". See: https://openmrs.atlassian.net/wiki/spaces/docs/pages/25469882/REST+Module

For any UI that displays a paginated view of the full data set, we MUST handle the server-side pagination properly,
or else the UI does not correctly display the full data set.
This hook does that by providing callback functions for navigating to different pages of the results, and
lazy-loads the data on each page as needed.

Note that this hook is not suitable for use for situations that require client-side sorting or filtering
of the data set. In that case, all data must be loaded onto client-side first.

## Type Parameters

### T

`T`

## Parameters

### url

The URL of the paginated rest endpoint. \
           It should be populated with any needed GET params, except `limit`, `startIndex` or `totalCount`,
           which will be overridden and manipulated by the `goTo*` callbacks.
           Similar to useSWR, this param can be null to disable fetching.

`string` | `URL`

### pageSize

`number`

The number of results to return per page / fetch. Note that this value MUST NOT exceed
           "webservices.rest.maxResultsAbsolute", which should be reasonably high by default (1000).

### options

[`UseServerPaginationOptions`](../interfaces/UseServerPaginationOptions.md)\<`OpenMRSPaginatedResponse`\<`T`\>\> = `{}`

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

> **mutate**: `KeyedMutator`\<`FetchResponse`\<`OpenMRSPaginatedResponse`\<`T`\>\>\>

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

 - `useOpenmrsInfinite`
 - `useOpenmrsFetchAll`
 - `usePagination` for pagination of client-side data`
@see `useFhirPagination``
