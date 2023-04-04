/** @module @category UI */
import { useMemo, useState } from "react";

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

  return {
    results,
    totalPages,
    currentPage: page,
    paginated: data.length > resultsPerPage,
    showNextButton: page < totalPages,
    showPreviousButton: page > 1,
    goTo(page: number) {
      setPage(Math.max(1, Math.min(totalPages, page)));
    },
    goToNext() {
      if (page < totalPages) {
        setPage(page + 1);
      }
    },
    goToPrevious() {
      if (page > 1) {
        setPage(page - 1);
      }
    },
  };
}
