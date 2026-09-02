/** @module @category UI */
import { useCallback, useMemo, useState } from 'react';

const defaultResultsPerPage = 10;

/**
 * Use this hook to paginate data that already exists on the client side.
 * Note that if the data is obtained from server-side, the caller must handle server-side pagination manually.
 *
 * `goTo`, `goToNext` and `goToPrevious` keep the same identity for the life of the component, so they are
 * safe to list in a dependency array. `currentPage` is bounded by the data, so it can change on its own
 * when the data shrinks; a component reacting to `currentPage` should expect that.
 *
 * @see `useServerPagination` for hook that automatically manages server-side pagination.
 * @see `useServerInfinite` for hook to get all data loaded onto the client-side
 * @param data
 * @param resultsPerPage
 * @returns
 */
export function usePagination<T>(data: Array<T> = [], resultsPerPage = defaultResultsPerPage) {
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = useMemo(
    () =>
      typeof resultsPerPage === 'number' && resultsPerPage > 0
        ? Math.max(1, Math.ceil(data.length / resultsPerPage))
        : 1,
    [data.length, resultsPerPage],
  );

  // If requested page is past the end, set to the end. Done here to retain referential stability
  // on the functions returned by this hook
  if (requestedPage > totalPages) {
    setRequestedPage(totalPages);
  }

  const page = Math.min(Math.max(1, requestedPage), totalPages);

  const results = useMemo(() => {
    const lowerBound = (page - 1) * resultsPerPage;
    const upperBound = (page + 0) * resultsPerPage;
    return data.slice(lowerBound, upperBound);
  }, [data, page, resultsPerPage]);

  const goTo = useCallback((page: number) => {
    if (!Number.isInteger(page) || page < 1) {
      console.warn(`usePagination: ignoring goTo(${page}); page must be a positive integer.`);
      return;
    }
    setRequestedPage(page);
  }, []);

  // overflow clamping happens in render; see the setRequestedPage() call above
  const goToNext = useCallback(() => {
    setRequestedPage((p) => p + 1);
  }, []);

  const goToPrevious = useCallback(() => {
    setRequestedPage((p) => Math.max(1, p - 1));
  }, []);

  const memoisedPaginatedData = useMemo(
    () => ({
      results,
      totalPages,
      currentPage: page,
      paginated: data.length > resultsPerPage,
      showNextButton: page < totalPages,
      showPreviousButton: page > 1,
      goTo,
      goToNext,
      goToPrevious,
    }),
    [results, totalPages, data.length, resultsPerPage, page, goTo, goToNext, goToPrevious],
  );

  return memoisedPaginatedData;
}
