import React, { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash-es/debounce";
import { useTranslation } from "react-i18next";
import {
  Button,
  Search,
  RadioButton,
  RadioButtonGroup,
  Loading,
  RadioButtonSkeleton,
} from "@carbon/react";
import { useConfig } from "@openmrs/esm-framework";
import { LocationEntry } from "../types";
import { useLoginLocations } from "../choose-location/choose-location.resource";
import styles from "./location-picker.scss";

interface LocationPickerProps {
  currentUser: string;
  loginLocations: Array<LocationEntry>;
  onChangeLocation(locationUuid: string): void;
  hideWelcomeMessage?: boolean;
  currentLocationUuid?: string;
  isLoginEnabled: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  currentUser,
  loginLocations,
  onChangeLocation,
  hideWelcomeMessage,
  currentLocationUuid,
  isLoginEnabled,
}) => {
  const { t } = useTranslation();
  const config = useConfig();
  const searchTimeout = 300;
  const inputRef = useRef();
  const { chooseLocation } = config;
  const userDefaultLoginLocation = "userDefaultLoginLocationKey";

  const getDefaultUserLoginLocation = () => {
    const userLocation = window.localStorage.getItem(
      `${userDefaultLoginLocation}${currentUser}`
    );
    const isValidLocation = loginLocations?.some(
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

  const [pageSize, setPageSize] = useState(() => {
    if (!isLoading && totalResults && chooseLocation.numberToShow) {
      return Math.min(chooseLocation.numberToShow, totalResults);
    }
    return chooseLocation.numberToShow;
  });

  useEffect(() => {
    if (activeLocation) {
      window.localStorage.setItem(
        `${userDefaultLoginLocation}${currentUser}`,
        activeLocation
      );
    }
  }, [activeLocation, currentUser]);

  useEffect(() => {
    if (isSubmitting) {
      onChangeLocation(activeLocation);
      setIsSubmitting(false);
    }
  }, [isSubmitting, activeLocation, onChangeLocation]);

  const search = debounce((location: string) => {
    setActiveLocation("");
    setSearchTerm(location);
  }, searchTimeout);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
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
            {!isLoading ? (
              <>
                <div className={styles.locationResultsContainer}>
                  {locations?.length > 0 && (
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
                    <Loading
                      small
                      withOverlay={false}
                      description={t("loading", "Loading")}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className={styles.loadingContainer}>
                <RadioButtonSkeleton className={styles.radioButtonSkeleton} />
              </div>
            )}
          </div>
          <div className={styles.confirmButton}>
            <Button
              kind="primary"
              type="submit"
              disabled={!activeLocation || !isLoginEnabled}
            >
              {t("confirm", "Confirm")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPicker;
