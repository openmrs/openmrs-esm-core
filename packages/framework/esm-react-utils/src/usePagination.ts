/** @module @category UI */
import { useCallback, useMemo, useState } from "react";

const defaultResultsPerPage = 10;

export function usePagination<T>(
  data: Array<T> = [],
  resultsPerPage = defaultResultsPerPage
) {
  const [page, setPage] = useState(1);
  const totalPages = useMemo(
    () =>
      typeof resultsPerPage === "number" && resultsPerPage > 0
        ? Math.max(1, Math.ceil(data.length / resultsPerPage))
        : 1,
    [data.length, resultsPerPage]
  );

  const results = useMemo(() => {
    const lowerBound = (page - 1) * resultsPerPage;
    const upperBound = (page + 0) * resultsPerPage;
    return data.slice(lowerBound, upperBound);
  }, [data, page, resultsPerPage]);

  const goTo = useCallback(
    (page: number) => {
      setPage(Math.max(1, Math.min(totalPages, page)));
    },
    [setPage, totalPages]
  );
  const goToNext = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages, setPage]);

  const goToPrevious = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

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
    [
      results,
      totalPages,
      data.length,
      resultsPerPage,
      page,
      goTo,
      goToNext,
      goToPrevious,
    ]
  );

  return memoisedPaginatedData;
}
