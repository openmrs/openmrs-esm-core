[O3 Framework](../API.md) / useFhirFetchAll

# Function: useFhirFetchAll()

> **useFhirFetchAll**\<`T`\>(`url`, `options`): `UseServerInfiniteReturnObject`\<`T`, `Bundle`\>

Defined in: [packages/framework/esm-react-utils/src/useFhirFetchAll.ts:19](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useFhirFetchAll.ts#L19)

This hook handles fetching results from *all* pages of a paginated FHIR REST endpoint, making multiple requests
as needed.
This function is the FHIR counterpart of `useOpenmrsPagination`.

## Type Parameters

### T

`T` *extends* `ResourceBase`

## Parameters

### url

`any`

The URL of the paginated rest endpoint.
           Similar to useSWRInfinite, this param can be null to disable fetching.

### options

[`UseServerFetchAllOptions`](../interfaces/UseServerFetchAllOptions.md)\<`Bundle`\> = `{}`

The options object

## Returns

`UseServerInfiniteReturnObject`\<`T`, `Bundle`\>

a UseFhirInfiniteReturnObject object

## See

 - `useFhirPagination`
 - `useFhirInfinite`
 - `useOpenmrsFetchAll``
