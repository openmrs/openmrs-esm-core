import React, { useCallback, useId, useMemo, useState } from 'react';
import {
  InlineLoading,
  InlineNotification,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
  Search,
} from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { useOnVisible } from '@openmrs/esm-framework';
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
  const [searchTerm, setSearchTerm] = useState('');
  const searchId = useId();

  const { location: defaultLocation } = useLocationByUuid(defaultLocationUuid);

  const {
    locations: fetchedLocations,
    isLoading,
    hasMore,
    loadingNewData,
    error,
    setPage,
  } = useLocations(locationTag, locationsPerRequest, searchTerm);

  const locations = useMemo(() => {
    if (defaultLocation && !searchTerm && defaultLocationUuid) {
      return [defaultLocation, ...fetchedLocations.filter(({ resource }) => resource.id !== defaultLocationUuid)];
    }
    return fetchedLocations ?? [];
  }, [defaultLocation, fetchedLocations, defaultLocationUuid, searchTerm]);

  const handleSearchChange = useCallback(
    (searchQuery: string) => {
      onChange();
      setSearchTerm(searchQuery.trim());
    },
    [onChange],
  );

  const loadMore = useCallback(() => {
    if (loadingNewData || !hasMore) {
      return;
    }
    setPage((page) => page + 1);
  }, [loadingNewData, hasMore, setPage]);

  const loadingIconRef = useOnVisible(loadMore);

  const infiniteScrollTriggerIndex = hasMore ? Math.max(0, Math.floor(locations.length - locationsPerRequest / 2)) : -1;

  return (
    <>
      <Search
        aria-describedby={error ? `${searchId}-error` : undefined}
        labelText={getCoreTranslation('searchForLocation')}
        id={searchId}
        placeholder={getCoreTranslation('searchForLocation')}
        onChange={(event) => handleSearchChange(event.target.value)}
        size="lg"
      />
      {error && (
        <div className={styles.errorNotification} id={`${searchId}-error`}>
          <InlineNotification
            kind="error"
            subtitle={getCoreTranslation(
              'errorLoadingLoginLocations',
              'Unable to load login locations. Please try again or contact support if the problem persists.',
            )}
            title={getCoreTranslation('error', 'Error')}
          />
        </div>
      )}
      <div className={styles.searchResults}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <RadioButtonSkeleton key={index} className={styles.radioButtonSkeleton} role="progressbar" />
            ))}
          </div>
        ) : (
          <>
            <div className={styles.locationResultsContainer}>
              {locations.length > 0 ? (
                <RadioButtonGroup
                  name="loginLocations"
                  onChange={(value) => {
                    onChange(value?.toString());
                  }}
                  orientation="vertical"
                  valueSelected={selectedLocationUuid}
                >
                  {locations.map((entry, i) => (
                    <RadioButton
                      className={styles.locationRadioButton}
                      id={entry.resource.id}
                      key={entry.resource.id}
                      labelText={
                        <span ref={i === infiniteScrollTriggerIndex ? loadingIconRef : null}>
                          {entry.resource.name}
                        </span>
                      }
                      name={entry.resource.name}
                      value={entry.resource.id}
                    />
                  ))}
                </RadioButtonGroup>
              ) : (
                <div className={styles.emptyState}>
                  <p className={styles.locationNotFound}>{getCoreTranslation('noResultsToDisplay')}</p>
                </div>
              )}
            </div>
            {loadingNewData && (
              <div className={styles.loadingIcon}>
                <InlineLoading description={getCoreTranslation('loading')} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
