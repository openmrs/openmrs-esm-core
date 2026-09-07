---
'@openmrs/esm-react-utils': minor
---

Give the `goTo`, `goToNext` and `goToPrevious` callbacks returned by `usePagination`, `useServerPagination`, `useOpenmrsPagination` and `useFhirPagination` stable identities, so a consumer listing one in a dependency array no longer gets an effect that re-fires as the data grows.

Consumers relying on that churn to reset the page need to change: `useEffect(() => goTo(1), [goTo])` no longer re-runs. `usePagination` now bounds `currentPage` by the data, so it corrects itself when the data shrinks instead of rendering an empty list, and `useServerPagination` returns to page 1 by itself when its `url` changes.

`useServerPagination` also applies a page requested before the first response instead of discarding it, then returns to the last real page if the response shows that page does not exist. Both hooks now reject a `goTo` that is not a positive integer rather than passing `NaN` through to a slice or a request URL, and `useServerPagination` warns once when a server reports no total count, since it cannot bounds-check that endpoint.

`useServerPagination` now returns `currentPageSize` as a number, alongside `totalCount`, rather than as the ref holding it. Anything reading `currentPageSize.current` should read `currentPageSize`.
