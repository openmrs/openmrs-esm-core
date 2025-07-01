[O3 Framework](../API.md) / usePagination

# Function: usePagination()

> **usePagination**\<`T`\>(`data`, `resultsPerPage`): `object`

Defined in: [packages/framework/esm-react-utils/src/usePagination.ts:15](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePagination.ts#L15)

Use this hook to paginate data that already exists on the client side.
Note that if the data is obtained from server-side, the caller must handle server-side pagination manually.

## Type Parameters

### T

`T`

## Parameters

### data

`T`[] = `[]`

### resultsPerPage

`number` = `defaultResultsPerPage`

## Returns

`object`

### currentPage

> **currentPage**: `number` = `page`

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

### paginated

> **paginated**: `boolean`

### results

> **results**: `T`[]

### showNextButton

> **showNextButton**: `boolean`

### showPreviousButton

> **showPreviousButton**: `boolean`

### totalPages

> **totalPages**: `number`

## See

 - `useServerPagination` for hook that automatically manages server-side pagination.
 - `useServerInfinite` for hook to get all data loaded onto the client-side
