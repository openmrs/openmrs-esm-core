import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import debounce from "lodash-es/debounce";
import {
  Button,
  InlineLoading,
  Search,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
} from "@carbon/react";
import {
  navigate,
  setSessionLocation,
  useConfig,
  useSession,
} from "@openmrs/esm-framework";
import type { LoginReferrer } from "../login/login.component";
import { useLoginLocations } from "../login.resource";
import styles from "./location-picker.scss";

interface LocationPickerProps {
  hideWelcomeMessage?: boolean;
  currentLocationUuid?: string;
  isLoginEnabled: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  hideWelcomeMessage,
  currentLocationUuid,
  isLoginEnabled,
}) => {
  const { t } = useTranslation();
  const searchTimeout = 300;
  const inputRef = useRef();
  const { user } = useSession();
  const currentUser = user?.display;
  const config = useConfig();
  const { chooseLocation } = config;
  const userDefaultLoginLocation = "userDefaultLoginLocationKey";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(() => {
    if (isSubmitting && inputRef.current) {
      let searchInput: HTMLInputElement = inputRef.current;
      searchInput.value = "";
      setSearchTerm(null);
    }
    return "";
  });

  const {
    locations,
    isLoading,
    hasMore,
    totalResults,
    loadingNewData,
    setPage,
  } = useLoginLocations(
    chooseLocation.useLoginLocationTag,
    chooseLocation.locationsPerRequest,
    searchTerm
  );

  const { state } = useLocation() as { state: LoginReferrer };
  const returnToUrl = new URLSearchParams(location?.search).get("returnToUrl");
  const referrer = state?.referrer;

  const changeLocation = useCallback(
    (locationUuid?: string) => {
      const sessionDefined = locationUuid
        ? setSessionLocation(locationUuid, new AbortController())
        : Promise.resolve();

      sessionDefined.then(() => {
        if (
          referrer &&
          !["/", "/login", "/login/location"].includes(referrer)
        ) {
          navigate({ to: "${openmrsSpaBase}" + referrer });
          return;
        }
        if (returnToUrl && returnToUrl !== "/") {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: config.links.loginSuccess });
        }
        return;
      });
    },
    [referrer, config.links.loginSuccess, returnToUrl]
  );

  const getDefaultUserLoginLocation = () => {
    const userLocation = window.localStorage.getItem(
      `${userDefaultLoginLocation}${currentUser}`
    );
    const isValidLocation = locations?.some(
      (location) => location.resource.id === userLocation
    );
    return isValidLocation ? userLocation : "";
  };

  const [activeLocation, setActiveLocation] = useState(() => {
    if (currentLocationUuid && hideWelcomeMessage) {
      return currentLocationUuid;
    }

    return getDefaultUserLoginLocation() ?? "";
  });

  const [pageSize, setPageSize] = useState(() => {
    if (!isLoading && totalResults && chooseLocation.numberToShow) {
      return Math.min(chooseLocation.numberToShow, totalResults);
    }
    return chooseLocation.numberToShow;
  });

  // Handle cases where the location picker is disabled, there is only one location, or there are no locations.
  useEffect(() => {
    if (!isLoading) {
      if (!config.chooseLocation.enabled || locations?.length === 1) {
        changeLocation(locations[0]?.resource.id);
      }
      if (!isLoading && !locations?.length) {
        changeLocation();
      }
    }
  }, [config.chooseLocation.enabled, isLoading, locations, changeLocation]);

  const search = debounce((location: string) => {
    setActiveLocation("");
    setSearchTerm(location);
  }, searchTimeout);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!activeLocation) return;

    setIsSubmitting(true);
    changeLocation(activeLocation);

    window.localStorage.setItem(
      `${userDefaultLoginLocation}${currentUser}`,
      activeLocation
    );
  };

  // Infinite scroll
  const observer = useRef(null);
  const loadingIconRef = useCallback(
    (node) => {
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
        }
      );
      if (node) observer.current.observe(node);
    },
    [loadingNewData, hasMore, setPage]
  );

  return (
    <div className={styles.locationPickerContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.locationCard}>
          <div className={styles.paddedContainer}>
            <p className={styles.welcomeTitle}>
              {t("welcome", "Welcome")} {currentUser}
            </p>
            <p className={styles.welcomeMessage}>
              {t(
                "selectYourLocation",
                "Select your location from the list below. Use the search bar to find your location."
              )}
            </p>
          </div>
          <Search
            autoFocus
            labelText={t("searchForLocation", "Search for a location")}
            id="search-1"
            placeholder={t("searchForLocation", "Search for a location")}
            onChange={(event) => search(event.target.value)}
            name="searchForLocation"
            size="lg"
          />
          <div className={styles.searchResults}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
              </div>
            ) : (
              <>
                <div className={styles.locationResultsContainer}>
                  {locations?.length && (
                    <RadioButtonGroup
                      valueSelected={activeLocation}
                      orientation="vertical"
                      name={activeLocation}
                      onChange={(ev) => {
                        setActiveLocation(ev.toString());
                      }}
                    >
                      {locations.map((entry) => (
                        <RadioButton
                          className={styles.locationRadioButton}
                          key={entry.resource.id}
                          id={entry.resource.name}
                          labelText={entry.resource.name}
                          value={entry.resource.id}
                        />
                      ))}
                    </RadioButtonGroup>
                  )}
                  {locations?.length === 0 && (
                    <div className={styles.emptyState}>
                      <p className={styles.locationNotFound}>
                        {t("noResultsToDisplay", "No results to display")}
                      </p>
                    </div>
                  )}
                </div>
                {hasMore && (
                  <div className={styles.loadingIcon} ref={loadingIconRef}>
                    <InlineLoading description={t("loading", "Loading")} />
                  </div>
                )}
              </>
            )}
          </div>
          <div className={styles.confirmButton}>
            <Button
              kind="primary"
              type="submit"
              disabled={!activeLocation || !isLoginEnabled || isSubmitting}
            >
              {isSubmitting ? (
                <InlineLoading
                  className={styles.loader}
                  description={t("submitting", "Submitting")}
                />
              ) : (
                <span>{t("confirm", "Confirm")}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPicker;
