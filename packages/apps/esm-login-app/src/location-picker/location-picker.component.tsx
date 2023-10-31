import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  InlineLoading,
  Search,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
} from "@carbon/react";
import {
  navigate,
  setSessionLocation,
  setUserProperties,
  showToast,
  useConfig,
  useConnectivity,
  useSession,
} from "@openmrs/esm-framework";
import type { LoginReferrer } from "../login/login.component";
import { useLoginLocation, useLoginLocations } from "../login.resource";
import styles from "./location-picker.scss";

interface LocationPickerProps {
  hideWelcomeMessage?: boolean;
  currentLocationUuid?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  hideWelcomeMessage,
  currentLocationUuid,
}) => {
  const { t } = useTranslation();
  const config = useConfig();
  const { chooseLocation } = config;
  const isLoginEnabled = useConnectivity();

  const [searchTerm, setSearchTerm] = useState(null);

  const { user, sessionLocation } = useSession();
  const { currentUser, userUuid, userProperties, userPreferredLocationUuid } =
    useMemo(
      () => ({
        currentUser: user?.display,
        userUuid: user?.uuid,
        userProperties: user?.userProperties,
        userPreferredLocationUuid: user?.userProperties?.defaultLoginLocation,
      }),
      [user]
    );

  const { isUserPreferredLocationPresent } = useLoginLocation(
    userPreferredLocationUuid
  );

  const { locations, isLoading, hasMore, loadingNewData, setPage } =
    useLoginLocations(
      chooseLocation.useLoginLocationTag,
      chooseLocation.locationsPerRequest,
      searchTerm
    );

  const [savePreference, setSavePreference] = useState(
    !!userPreferredLocationUuid
  );
  const [activeLocation, setActiveLocation] = useState(() => {
    if (currentLocationUuid && hideWelcomeMessage) {
      return currentLocationUuid;
    }
    return sessionLocation?.uuid ?? userProperties?.defaultLoginLocation;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { state } = useLocation() as { state: LoginReferrer };

  const updateUserPreference = useCallback(
    (locationUuid: string, saveUserPreference: boolean) => {
      if (saveUserPreference) {
        if (locationUuid === userProperties.defaultLoginLocation) {
          return;
        }
        // If the user checks the checkbox for saving the preference
        const updatedUserProperties = {
          ...userProperties,
          defaultLoginLocation: locationUuid,
        };
        const isUpdateFlow =
          new URLSearchParams(location?.search).get("update") === "true";
        setUserProperties(userUuid, updatedUserProperties).then(() => {
          showToast({
            title: !isUpdateFlow
              ? t(
                  "locationPreferenceAdded",
                  "Selected location will be used for your next logins"
                )
              : t(
                  "locationPreferenceUpdated",
                  "Login location preference updated"
                ),
            description: !isUpdateFlow
              ? t(
                  "selectedLocationPreferenceSetMessage",
                  "You can change your preference from the user dashboard"
                )
              : t(
                  "locationPreferenceAdded",
                  "Selected location will be used for your next logins"
                ),
            kind: "success",
          });
        });
      } else if (!!userProperties?.defaultLoginLocation) {
        // If the user doesn't want to save the preference,
        // the old preference should be deleted
        const updatedUserProperties = Object.fromEntries(
          Object.entries(userProperties).filter(
            ([key]) => key !== "defaultLoginLocation"
          )
        );
        setUserProperties(userUuid, updatedUserProperties).then(() => {
          showToast({
            title: t(
              "locationPreferenceRemoved",
              "Login location preference removed"
            ),
            description: t(
              "removedLoginLocationPreference",
              "The login location preference has been removed."
            ),
            kind: "success",
          });
        });
      }
    },
    [userProperties, userUuid, t]
  );

  const changeLocation = useCallback(
    (locationUuid?: string, saveUserPreference?: boolean) => {
      setIsSubmitting(true);

      const referrer = state?.referrer;
      const returnToUrl = new URLSearchParams(location?.search).get(
        "returnToUrl"
      );

      const sessionDefined = locationUuid
        ? setSessionLocation(locationUuid, new AbortController())
        : Promise.resolve();

      updateUserPreference(locationUuid, saveUserPreference);
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
    [state?.referrer, config.links.loginSuccess, updateUserPreference]
  );

  // Handle cases where the location picker is disabled, there is only one location, or there are no locations.
  useEffect(() => {
    if (!isLoading && !searchTerm) {
      if (!config.chooseLocation.enabled || locations?.length === 1) {
        changeLocation(locations[0]?.resource.id, false);
      }
      if (!locations?.length) {
        changeLocation();
      }
    }
  }, [
    changeLocation,
    config.chooseLocation.enabled,
    isLoading,
    locations,
    searchTerm,
  ]);

  // Handle cases where the login location is present in the userProperties.
  useEffect(() => {
    const isUpdateFlow =
      new URLSearchParams(location?.search).get("update") === "true";

    if (isUpdateFlow) {
      return;
    }
    if (isUserPreferredLocationPresent && !isSubmitting) {
      setActiveLocation(userPreferredLocationUuid);
      setSavePreference(true);
      changeLocation(userPreferredLocationUuid, true);
    }
  }, [
    changeLocation,
    isSubmitting,
    isUserPreferredLocationPresent,
    userPreferredLocationUuid,
  ]);

  const search = (location: string) => {
    setActiveLocation("");
    setSearchTerm(location);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!activeLocation) return;

    changeLocation(activeLocation, savePreference);
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
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
                <RadioButtonSkeleton
                  className={styles.radioButtonSkeleton}
                  role="progressbar"
                />
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
                      {locations.map((entry) => (
                        <RadioButton
                          className={styles.locationRadioButton}
                          key={entry.resource.id}
                          id={entry.resource.name}
                          name={entry.resource.name}
                          labelText={entry.resource.name}
                          value={entry.resource.id}
                        />
                      ))}
                    </RadioButtonGroup>
                  ) : (
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
            <Checkbox
              id="checkbox"
              className={styles.savePreferenceCheckbox}
              labelText={t(
                "rememberLocationForFutureLogins",
                "Remember my location for future logins"
              )}
              checked={savePreference}
              onChange={(_, { checked }) => setSavePreference(checked)}
            />
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
