import React from 'react';
import classNames from 'classnames';
import { Pagination as CarbonPagination, type PaginationProps as CarbonPaginationProps } from '@carbon/react';
import { ConfigurableLink, useLayoutType, usePaginationInfo } from '@openmrs/esm-react-utils';
import { getCoreTranslation } from '@openmrs/esm-translations';
import styles from './pagination.module.scss';

export interface PaginationProps {
  /** The count of current items displayed */
  currentItems: number;
  /** The count of total items displayed */
  totalItems: number;
  /** The current page number */
  pageNumber: number;
  /** The size of each page */
  pageSize: number;
  /** A callback to be called when the page changes */
  onPageNumberChange?: CarbonPaginationProps['onChange'];
  /** An optional URL the user should be directed to if they click on the link to see all results */
  dashboardLinkUrl?: string;
  /** Optional text to display instead of the default "See all" */
  dashboardLinkLabel?: string;
}

export interface CarbonPaginationTranslationProps {
  backwardText: string;
  forwardText: string;
  itemsPerPageText: string;
  itemRangeText: (min: number, max: number, total: number) => string;
  itemText: (min: number, max: number) => string;
  pageRangeText: (current: number, total: number) => string;
  pageText: (page: number, pagesUnknown?: boolean) => string;
}

/**
 * Returns translated text props for Carbon's Pagination component.
 */
export function getCarbonPaginationTranslationProps(): CarbonPaginationTranslationProps {
  return {
    backwardText: getCoreTranslation('paginationPreviousPage', 'Previous page'),
    forwardText: getCoreTranslation('paginationNextPage', 'Next page'),
    itemsPerPageText: getCoreTranslation('paginationItemsPerPage', 'Items per page:'),
    itemRangeText: (min: number, max: number, total: number) =>
      getCoreTranslation(
        'paginationItemRange',
        total === 1 ? '{{min}}–{{max}} of {{total}} item' : '{{min}}–{{max}} of {{total}} items',
        {
          count: total,
          min,
          max,
          total,
          totalItems: total,
        },
      ),
    itemText: (min: number, max: number) => {
      const count = max - min + 1;
      return getCoreTranslation('paginationItemText', count === 1 ? '{{min}}–{{max}} item' : '{{min}}–{{max}} items', {
        count,
        min,
        max,
      });
    },
    pageRangeText: (_current: number, total: number) =>
      getCoreTranslation('paginationOfPages', total === 1 ? 'of {{count}} page' : 'of {{count}} pages', {
        count: total,
        total,
      }),
    pageText: (page: number) =>
      getCoreTranslation('paginationPageText', 'page {{page}}', {
        page,
      }),
  };
}

/**
 * Re-usable pagination bar
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  onPageNumberChange,
  pageNumber,
  dashboardLinkUrl,
  currentItems,
  dashboardLinkLabel: urlLabel,
}) => {
  const { pageSizes, pageItemsCount } = usePaginationInfo(pageSize, totalItems, pageNumber, currentItems);
  const isTablet = useLayoutType() === 'tablet';
  const paginationTextProps = getCarbonPaginationTranslationProps();
  const itemsDisplayed = getCoreTranslation(
    'paginationItemsCount',
    totalItems === 1 ? '{{pageItemsCount}} / {{totalItems}} item' : '{{pageItemsCount}} / {{totalItems}} items',
    {
      count: totalItems,
      totalItems,
      pageItemsCount,
    },
  );

  return (
    <>
      {totalItems > 0 && (
        <div
          className={classNames({
            [styles.tablet]: isTablet,
            [styles.desktop]: !isTablet,
          })}
        >
          <div>
            {itemsDisplayed}
            {dashboardLinkUrl && (
              <ConfigurableLink to={dashboardLinkUrl} className={styles.configurableLink}>
                {urlLabel ?? getCoreTranslation('seeAll', 'See all')}
              </ConfigurableLink>
            )}
          </div>
          <CarbonPagination
            className={styles.pagination}
            page={pageNumber}
            pageSize={pageSize}
            pageSizes={pageSizes}
            totalItems={totalItems}
            onChange={onPageNumberChange}
            {...paginationTextProps}
            size={isTablet ? 'lg' : 'sm'}
          />
        </div>
      )}
    </>
  );
};
