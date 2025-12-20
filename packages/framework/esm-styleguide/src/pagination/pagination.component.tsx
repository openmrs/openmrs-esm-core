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
  const itemsDisplayed = getCoreTranslation('paginationItemsCount', '{{pageItemsCount}} / {{totalItems}} items', {
    totalItems,
    pageItemsCount,
  });

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
            pageRangeText={(_, total) =>
              getCoreTranslation('paginationOfPages', 'of {{count}} pages', { count: total })
            }
            size={isTablet ? 'lg' : 'sm'}
          />
        </div>
      )}
    </>
  );
};
