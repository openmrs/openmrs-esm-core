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
import { LocationEntry } from "../types";
import { useConfig } from "@openmrs/esm-framework";
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
  const config = useConfig();
  const { chooseLocation } = config;
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState<number>(chooseLocation.numberToShow);
  const userDefaultLoginLocation: string = "userDefaultLoginLocationKey";
  const getDefaultUserLoginLocation = (): string => {
    const userLocation = window.localStorage.getItem(
      `${userDefaultLoginLocation}${currentUser}`
    );
    const isValidLocation = loginLocations?.some(
      (location) => location.resource.id === userLocation
    );
    return isValidLocation ? userLocation : "";
  };
  const [activeLocation, setActiveLocation] = useState<string>(
    getDefaultUserLoginLocation() ?? ""
  );
  const [searchTerm, setSearchTerm] = useState("");

  const {
    locationData,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef();
  const searchTimeout = 300;

  useEffect(() => {
    if (isSubmitting) {
      onChangeLocation(activeLocation);
      setIsSubmitting(false);
    }
  }, [isSubmitting, activeLocation, onChangeLocation]);

  useEffect(() => {
    if (activeLocation) {
      window.localStorage.setItem(
        `${userDefaultLoginLocation}${currentUser}`,
        activeLocation
      );
    }
  }, [activeLocation, currentUser]);

  useEffect(() => {
    if (currentLocationUuid && hideWelcomeMessage) {
      setActiveLocation(currentLocationUuid);
    }
  }, [currentLocationUuid, hideWelcomeMessage]);

  useEffect(() => {
    if (isSubmitting && inputRef.current) {
      let searchInput: HTMLInputElement = inputRef.current;
      searchInput.value = "";
      setSearchTerm(null);
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (!isLoading && totalResults && chooseLocation.numberToShow) {
      setPageSize(Math.min(chooseLocation.numberToShow, totalResults));
    }
  }, [isLoading, totalResults, chooseLocation.numberToShow]);

  const search = debounce((location: string) => {
    setActiveLocation("");
    setSearchTerm(location);
  }, searchTimeout);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
  };

  // Infinte scrolling
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
          <div>
            <p className={styles.welcomeTitle}>
              {t("welcome", "Welcome")} {currentUser}
            </p>
            <p className={styles.welcomeMessage}>
              {t(
                "selectYourLocation",
                "Select your location from the list below. Use the search bar to search for your location."
              )}
            </p>
          </div>
          <Search
            autoFocus
            className={styles.searchBox}
            labelText={t("searchForLocation", "Search for a location")}
            id="search-1"
            placeholder={t("searchForLocation", "Search for a location")}
            onChange={(ev) => search(ev.target.value)}
            name="searchForLocation"
          />
          <div
            className={styles.searchResults}
            style={{ height: `${chooseLocation.numberToShow * 2.875}rem` }}
          >
            {!isLoading ? (
              <>
                <p className={styles.resultsCount}>
                  {searchTerm
                    ? `${totalResults ?? 0} ${
                        totalResults === 1
                          ? t("match", "match")
                          : t("matches", "matches")
                      } ${t("found", "found")}`
                    : `${t("showing", "Showing")} ${pageSize} ${t(
                        "of",
                        "of"
                      )} ${totalResults} ${t("locations", "locations")}`}
                </p>
                <div className={styles.locationResultsContainer}>
                  {locationData?.length > 0 && (
                    <RadioButtonGroup
                      valueSelected={activeLocation}
                      orientation="vertical"
                      name={activeLocation}
                      onChange={(ev) => {
                        setActiveLocation(ev.toString());
                      }}
                    >
                      {locationData.map((entry) => (
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
                  {locationData?.length === 0 && (
                    <p className={styles.locationNotFound}>
                      {t(
                        "locationNotFound",
                        "Sorry, no matching location was found"
                      )}
                    </p>
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
              <div>
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
