import { useMemo } from 'react';

export function usePaginationInfo(pageSize: number, totalItems: number, pageNumber: number, currentItems: number) {
  const pageSizes = useMemo(() => {
    let numberOfPages = Math.ceil(totalItems / pageSize);
    if (isNaN(numberOfPages)) {
      numberOfPages = 0;
    }

    return [...Array(numberOfPages).keys()].map((x) => {
      return (x + 1) * pageSize;
    });
  }, [pageSize, totalItems]);

  const pageItemsCount = useMemo(() => {
    let pageItemsCount = 0;
    if (pageSize > totalItems) {
      pageItemsCount = totalItems;
    } else if (pageSize * pageNumber > totalItems) {
      pageItemsCount = pageSize * (pageNumber - 1) + currentItems;
    } else {
      pageItemsCount = pageSize * pageNumber;
    }

    return pageItemsCount;
  }, [pageSize, totalItems, pageNumber, currentItems]);

  return {
    pageSizes,
    pageItemsCount,
  };
}
