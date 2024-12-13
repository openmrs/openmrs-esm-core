import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { InlineLoading, RadioButton, RadioButtonGroup, RadioButtonSkeleton, Search } from '@carbon/react';
import { useLocationByUuid, useLocations } from './location-picker.resource';
import styles from './location-picker.module.scss';

interface LocationPickerProps {
  selectedLocationUuid?: string;
  defaultLocationUuid?: string;
  locationTag?: string;
  locationsPerRequest?: number;
  onChange: (locationUuid?: string) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  selectedLocationUuid,
  defaultLocationUuid,
  locationTag,
  locationsPerRequest = 50,
  onChange,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  let defaultLocation = useLocationByUuid(defaultLocationUuid).location;

  const {
    locations: fetchedLocations,
    isLoading,
    hasMore,
    loadingNewData,
    setPage,
  } = useLocations(locationTag, locationsPerRequest, searchTerm);

  const locations = useMemo(() => {
    if (defaultLocation && !searchTerm) {
      return [defaultLocation, ...fetchedLocations?.filter(({ resource }) => resource.id !== defaultLocationUuid)];
    }
    return fetchedLocations;
  }, [defaultLocation, fetchedLocations]);

  const search = (location: string) => {
    onChange();
    setSearchTerm(location);
  };

  // Infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingIconRef = useCallback(
    (node: HTMLDivElement) => {
      if (loadingNewData) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((page) => page + 1);
          }
        },
        {
          threshold: 1,
        },
      );
      if (node) observer.current.observe(node);
    },
    [loadingNewData, hasMore, setPage],
  );

  const reloadIndex = hasMore ? locations.length - locationsPerRequest / 2 : -1;

  return (
    <div>
      <Search
        autoFocus
        labelText={t('searchForLocation', 'Search for a location')}
        id="search-1"
        placeholder={t('searchForLocation', 'Search for a location')}
        onChange={(event) => search(event.target.value)}
        name="searchForLocation"
        size="lg"
      />
      <div className={styles.searchResults}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
            <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
            <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
            <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
            <RadioButtonSkeleton className={styles.radioButtonSkeleton} role="progressbar" />
          </div>
        ) : (
          <>
            <div className={styles.locationResultsContainer}>
              {locations?.length > 0 ? (
                <RadioButtonGroup
                  name="loginLocations"
                  onChange={(ev) => {
                    onChange(ev.toString());
                  }}
                  orientation="vertical"
                  valueSelected={selectedLocationUuid}
                >
                  {locations.map((entry, i) => (
                    <RadioButton
                      className={styles.locationRadioButton}
                      key={entry.resource.id}
                      id={entry.resource.id}
                      name={entry.resource.name}
                      labelText={<span ref={i == reloadIndex ? loadingIconRef : null}>{entry.resource.name}</span>}
                      value={entry.resource.id}
                    />
                  ))}
                </RadioButtonGroup>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.locationNotFound}>{t('noResultsToDisplay', 'No results to display')}</p>
                </div>
              )}
            </div>
            {loadingNewData && (
              <div className={styles.loadingIcon}>
                <InlineLoading description={t('loading', 'Loading')} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
