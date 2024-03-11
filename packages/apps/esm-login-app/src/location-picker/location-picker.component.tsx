import React, { useState, useEffect, useRef, useCallback, LegacyRef, useMemo } from 'react';
import { useLocation, type Location, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  InlineLoading,
  Search,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
} from '@carbon/react';
import {
  navigate,
  setSessionLocation,
  useConfig,
  useConnectivity,
  useDebounce,
  useSession,
} from '@openmrs/esm-framework';
import type { LoginReferrer } from '../login/login.component';
import styles from './location-picker.scss';
import { useDefaultLocation, useInfiniteScrolling, useLoginLocations } from './location-picker.resource';
import type { ConfigSchema } from '../config-schema';

interface LocationPickerProps {}

const LocationPicker: React.FC<LocationPickerProps> = () => {
  const { t } = useTranslation();
  const config = useConfig<ConfigSchema>();
  const { chooseLocation } = config;
  const isLoginEnabled = useConnectivity();
  const [searchTerm, setSearchTerm] = useState(null);
  const debouncedSearchQuery = useDebounce(searchTerm);
  const [searchParams] = useSearchParams();

  const isUpdateFlow = useMemo(() => searchParams.get('update') === 'true', [searchParams]);
  const {
    isLoadingValidation,
    defaultLocation,
    updateDefaultLocation,
    savePreference,
    setSavePreference,
    defaultLocationFhir,
  } = useDefaultLocation(isUpdateFlow, debouncedSearchQuery);

  const { user, sessionLocation } = useSession();
  const { currentUser } = useMemo(
    () => ({
      currentUser: user?.display,
      userUuid: user?.uuid,
      userProperties: user?.userProperties,
    }),
    [user],
  );

  const {
    locations: fetchedLocations,
    isLoading,
    hasMore,
    loadingNewData,
    setPage,
  } = useLoginLocations(chooseLocation.useLoginLocationTag, chooseLocation.locationsPerRequest, debouncedSearchQuery);

  const isLoadingLocations = isLoading || isLoadingValidation;

  const locations = useMemo(() => {
    if (!defaultLocationFhir?.length || !fetchedLocations) {
      return fetchedLocations;
    }

    return [
      ...(defaultLocationFhir ?? []),
      ...fetchedLocations?.filter(({ resource }) => resource.id !== defaultLocationFhir?.[0].resource.id),
    ];
  }, [defaultLocationFhir, fetchedLocations]);

  const [activeLocation, setActiveLocation] = useState(() => {
    return sessionLocation?.uuid ?? defaultLocation;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };

  const changeLocation = useCallback(
    (locationUuid?: string, saveUserPreference?: boolean) => {
      setIsSubmitting(true);

      const referrer = state?.referrer;
      const returnToUrl = new URLSearchParams(location?.search).get('returnToUrl');

      const sessionDefined = locationUuid ? setSessionLocation(locationUuid, new AbortController()) : Promise.resolve();

      updateDefaultLocation(locationUuid, saveUserPreference);
      sessionDefined.then(() => {
        if (referrer && !['/', '/login', '/login/location'].includes(referrer)) {
          navigate({ to: '${openmrsSpaBase}' + referrer });
          return;
        }
        if (returnToUrl && returnToUrl !== '/') {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: config.links.loginSuccess });
        }
        return;
      });
    },
    [state?.referrer, config.links.loginSuccess, updateDefaultLocation],
  );

  // Handle cases where the location picker is disabled, there is only one location, or there are no locations.
  useEffect(() => {
    if (!isLoadingLocations && !debouncedSearchQuery) {
      if (!config.chooseLocation.enabled || locations?.length === 1) {
        changeLocation(locations[0]?.resource.id, false);
      }
      if (!locations?.length) {
        changeLocation();
      }
    }
  }, [changeLocation, config.chooseLocation.enabled, isLoadingLocations, locations, debouncedSearchQuery]);

  // Handle cases where the login location is present in the userProperties.
  useEffect(() => {
    if (isUpdateFlow) {
      return;
    }

    if (defaultLocation && !isSubmitting) {
      setActiveLocation(defaultLocation);
      changeLocation(defaultLocation, true);
    }
  }, [changeLocation, isSubmitting, defaultLocation, isUpdateFlow]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = useCallback(
    (evt: React.FormEvent<HTMLFormElement>) => {
      evt.preventDefault();

      if (!activeLocation) return;

      changeLocation(activeLocation, savePreference);
    },
    [activeLocation, changeLocation, savePreference],
  );

  const handleFetchNextSet = useCallback(() => {
    setPage((page) => page + 1);
  }, [setPage]);

  const { observer, loadingIconRef } = useInfiniteScrolling({
    inLoadingState: loadingNewData,
    onIntersection: handleFetchNextSet,
    shouldLoadMore: hasMore,
  });
  const reloadIndex = hasMore ? Math.floor(locations.length * 0.5) : -1;

  return (
    <div className={styles.locationPickerContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.locationCard}>
          <div className={styles.paddedContainer}>
            <p className={styles.welcomeTitle}>
              {t('welcome', 'Welcome')} {currentUser}
            </p>
            <p className={styles.welcomeMessage}>
              {t(
                'selectYourLocation',
                'Select your location from the list below. Use the search bar to find your location.',
              )}
            </p>
          </div>
          <Search
            autoFocus
            labelText={t('searchForLocation', 'Search for a location')}
            id="search-1"
            placeholder={t('searchForLocation', 'Search for a location')}
            onChange={handleSearch}
            name="searchForLocation"
            size="lg"
            value={searchTerm}
          />
          <div className={styles.searchResults}>
            {isLoadingLocations ? (
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
                      valueSelected={activeLocation}
                      orientation="vertical"
                      name="Login locations"
                      onChange={(ev) => {
                        setActiveLocation(ev.toString());
                      }}
                    >
                      {locations.map((entry, i) => (
                        <RadioButton
                          className={styles.locationRadioButton}
                          key={entry.resource.id}
                          id={entry.resource.name}
                          name={entry.resource.name}
                          labelText={entry.resource.name}
                          value={entry.resource.id}
                          ref={i === reloadIndex ? loadingIconRef : null}
                        />
                      ))}
                    </RadioButtonGroup>
                  ) : (
                    <div className={styles.emptyState}>
                      <p className={styles.locationNotFound}>{t('noResultsToDisplay', 'No results to display')}</p>
                    </div>
                  )}
                </div>
                {hasMore && (
                  <div className={styles.loadingIcon}>
                    <InlineLoading description={t('loading', 'Loading')} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.confirmButton}>
            <Checkbox
              id="checkbox"
              className={styles.savePreferenceCheckbox}
              labelText={t('rememberLocationForFutureLogins', 'Remember my location for future logins')}
              checked={savePreference}
              onChange={(_, { checked }) => setSavePreference(checked)}
            />
            <Button kind="primary" type="submit" disabled={!activeLocation || !isLoginEnabled || isSubmitting}>
              {isSubmitting ? (
                <InlineLoading className={styles.loader} description={t('submitting', 'Submitting')} />
              ) : (
                <span>{t('confirm', 'Confirm')}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPicker;
