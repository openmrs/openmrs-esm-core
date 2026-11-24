[O3 Framework](../API.md) / useOpenmrsFetchAll

# Function: useOpenmrsFetchAll()

> **useOpenmrsFetchAll**\<`T`\>(`url`, `options?`): `UseServerInfiniteReturnObject`\<`T`, `OpenMRSPaginatedResponse`\<`T`\>\>

Defined in: [packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts:49](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useOpenmrsFetchAll.ts#L49)

Most OpenMRS REST endpoints that return a list of objects, such as getAll or search, are server-side paginated.
This hook handles fetching results from *all* pages of a paginated OpenMRS REST endpoint, making multiple requests
as needed.
Global URL-prefix mutation refreshes mounted collections. Clearing matching cache data while unmounted
refreshes all pages on the next mount, unless mount revalidation is explicitly disabled.
The returned bound mutate retains SWR Infinite's page-array and per-page revalidation contract.

## Type Parameters

### T

`T`

## Parameters

### url

`string` \| `URL` \| `null`

The URL of the paginated OpenMRS REST endpoint. Note that the `limit` GET param can be set to specify
           the page size; if not set, the page size defaults to the `webservices.rest.maxResultsDefault` value defined
           server-side.
           Similar to useSWRInfinite, this param can be null to disable fetching.

### options?

[`UseServerFetchAllOptions`](../interfaces/UseServerFetchAllOptions.md)\<`OpenMRSPaginatedResponse`\<`T`\>\> = `{}`

The options object

## Returns

`UseServerInfiniteReturnObject`\<`T`, `OpenMRSPaginatedResponse`\<`T`\>\>

a UseOpenmrsInfiniteReturnObject object

## See

 - `useOpenmrsPagination`
 - `useOpenmrsInfinite`
 - `useFhirFetchAll`
