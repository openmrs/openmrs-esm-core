[O3 Framework](../API.md) / useFhirInfinite

# Function: useFhirInfinite()

> **useFhirInfinite**\<`T`\>(`url`, `options`): `UseServerInfiniteReturnObject`\<`T`, `Bundle`\>

Defined in: [packages/framework/esm-react-utils/src/useFhirInfinite.ts:24](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/useFhirInfinite.ts#L24)

Fhir REST endpoints that return a list of objects, are server-side paginated.
The server limits the max number of results being returned, and multiple requests are needed to get the full data set
if its size exceeds this limit.

This function is the FHIR counterpart of `useOpenmrsInfinite`.

## Type Parameters

### T

`T` *extends* `ResourceBase`

## Parameters

### url

The URL of the paginated rest endpoint.
           Similar to useSWRInfinite, this param can be null to disable fetching.

`string` | `URL`

### options

[`UseServerInfiniteOptions`](../interfaces/UseServerInfiniteOptions.md)\<`Bundle`\> = `{}`

The options object

## Returns

`UseServerInfiniteReturnObject`\<`T`, `Bundle`\>

a UseServerInfiniteReturnObject object

## See

 - `useFhirPagination`
 - `useFhirFetchAll`
 - `useOpenmrsInfinite`
