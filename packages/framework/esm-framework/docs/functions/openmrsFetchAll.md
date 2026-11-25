[O3 Framework](../API.md) / openmrsFetchAll

# Function: openmrsFetchAll()

> **openmrsFetchAll**\<`T`\>(`url`, `fetcher?`): `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`PaginatedResults`\<`T`\>\>\>

Defined in: [packages/framework/esm-api/src/openmrs-fetch-all.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-api/src/openmrs-fetch-all.ts#L20)

Fetches a complete OpenMRS REST collection by following its next links.
Preserves the requested page size and the first response's metadata. Rejects
if any page fails, rather than returning an incomplete collection as success.

## Type Parameters

### T

`T`

## Parameters

### url

`string`

The initial REST query, including any filters and page-size limit.

### fetcher?

(`url`) => `Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`PaginatedResults`\<`T`\>\>\>

The page fetcher. Defaults to openmrsFetch; a custom fetcher can
supply request options such as an AbortSignal.

## Returns

`Promise`\<[`FetchResponse`](../interfaces/FetchResponse.md)\<`PaginatedResults`\<`T`\>\>\>
