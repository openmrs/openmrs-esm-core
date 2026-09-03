[O3 Framework](../API.md) / usePagination

# Function: usePagination()

> **usePagination**\<`T`\>(`data`, `resultsPerPage`): `object`

Defined in: [packages/framework/esm-react-utils/src/usePagination.ts:20](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-react-utils/src/usePagination.ts#L20)

Use this hook to paginate data that already exists on the client side.
Note that if the data is obtained from server-side, the caller must handle server-side pagination manually.

`goTo`, `goToNext` and `goToPrevious` keep the same identity for the life of the component, so they are
safe to list in a dependency array. `currentPage` is bounded by the data, so it can change on its own
when the data shrinks; a component reacting to `currentPage` should expect that.

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
