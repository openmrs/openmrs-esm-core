import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeaderGlobalAction } from '@carbon/react';
import { Close, Switcher } from '@carbon/react/icons';
import { isDesktop, navigate, useLayoutType, useOnClickOutside } from '@openmrs/esm-framework';
import AppSearchOverlay from '../app-search-overlay/app-search-overlay.component';
import styles from './app-search-icon.scss';
import { useParams, useSearchParams } from 'react-router-dom';

interface AppSearchLaunchProps {}

const AppSearchLaunch: React.FC<AppSearchLaunchProps> = () => {
  const { t } = useTranslation();
  const layout = useLayoutType();
  const { page } = useParams();
  const isSearchPage = useMemo(() => page === 'search', [page]);
  const [searchParams] = useSearchParams();
  const initialSearchTerm = isSearchPage ? searchParams.get('query') : '';

  const [showSearchInput, setShowSearchInput] = useState(false);
  const [canClickOutside, setCanClickOutside] = useState(false);

  const handleCloseSearchInput = useCallback(() => {
    if (isDesktop(layout) && !isSearchPage) {
      setShowSearchInput(false);
    }
  }, [setShowSearchInput, isSearchPage, layout]);

  const ref = useOnClickOutside<HTMLDivElement>(handleCloseSearchInput, canClickOutside);

  const handleGlobalAction = useCallback(() => {
    if (showSearchInput) {
      if (isSearchPage) {
        navigate({
          to: window.sessionStorage.getItem('searchReturnUrl') ?? '${openmrsSpaBase}/',
        });
        window.sessionStorage.removeItem('searchReturnUrl');
      }
      setShowSearchInput(false);
    } else {
      setShowSearchInput(true);
    }
  }, [isSearchPage, setShowSearchInput, showSearchInput]);

  useEffect(() => {
    // Search input should always be open when we direct to the search page.
    setShowSearchInput(isSearchPage);
    if (isSearchPage) {
      setCanClickOutside(false);
    }
  }, [isSearchPage]);

  useEffect(() => {
    showSearchInput ? setCanClickOutside(true) : setCanClickOutside(false);
  }, [showSearchInput]);

  return (
    <div className={styles.appSearchIconWrapper} ref={ref}>
      {showSearchInput && <AppSearchOverlay onClose={handleGlobalAction} query={initialSearchTerm} />}

      <div className={`${showSearchInput && styles.closeButton}`}>
        <HeaderGlobalAction
          aria-label={t('searchApp', 'Search App')}
          aria-labelledby="Search App"
          className={`${showSearchInput ? styles.activeSearchIconButton : styles.searchIconButton}`}
          enterDelayMs={500}
          name="SearchAppIcon"
          data-testid="searchAppIcon"
          onClick={handleGlobalAction}
        >
          {showSearchInput ? <Close size={20} /> : <Switcher size={20} />}
        </HeaderGlobalAction>
      </div>
    </div>
  );
};

export default AppSearchLaunch;
