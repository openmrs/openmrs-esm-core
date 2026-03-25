[O3 Framework](../API.md) / useOpenmrsInfinite

# Function: useOpenmrsInfinite()

> **useOpenmrsInfinite**\<`T`\>(`url`, `options`): `UseServerInfiniteReturnObject`\<`T`, `OpenMRSPaginatedResponse`\<`T`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts:102](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsInfinite.ts#L102)

Most REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
The server limits the max number of results being returned, and multiple requests are needed to get the full data set
if its size exceeds this limit.
The max number of results per request is configurable server-side
with the key "webservices.rest.maxResultsDefault". See: https://openmrs.atlassian.net/wiki/spaces/docs/pages/25469882/REST+Module

This hook fetches data from a paginated rest endpoint, initially by fetching the first page of the results.
It provides a callback to load data from subsequent pages as needed. This hook is intended to serve UIs that
provide infinite loading / scrolling of results. Unlike `useOpenmrsPagination`, this hook does not allow random access
(and lazy-loading) of any arbitrary page; rather, it fetches pages sequentially starting form the initial page, and the next page
is fetched by calling `loadMore`. See: https://swr.vercel.app/docs/pagination#useswrinfinite

## Type Parameters

### T

`T`

## Parameters

### url

The URL of the paginated rest endpoint. Note that the `limit` GET param can be set to specify
           the page size; if not set, the page size defaults to the `webservices.rest.maxResultsDefault` value defined
           server-side.
           Similar to useSWRInfinite, this param can be null to disable fetching.

`string` | `URL`

### options

[`UseServerInfiniteOptions`](../interfaces/UseServerInfiniteOptions.md)\<`OpenMRSPaginatedResponse`\<`T`\>\> = `{}`

The options object

## Returns

`UseServerInfiniteReturnObject`\<`T`, `OpenMRSPaginatedResponse`\<`T`\>\>

a UseServerInfiniteReturnObject object

## See

 - `useOpenmrsPagination`
 - `useOpenmrsFetchAll`
 - `useFhirInfinite`
