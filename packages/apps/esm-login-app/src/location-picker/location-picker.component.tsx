import React from "react";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import { Trans, useTranslation } from "react-i18next";
import { LocationEntry } from "../types";
import styles from "./location-picker.component.scss";
import Search from "carbon-components-react/es/components/Search";
import { createErrorHandler, useConfig } from "@openmrs/esm-framework";
import RadioButtonGroup from "carbon-components-react/es/components/RadioButtonGroup";
import RadioButton from "carbon-components-react/es/components/RadioButton";
import Button from "carbon-components-react/es/components/Button";

interface LocationDataState {
  activeLocation: string;
  locationResult: Array<LocationEntry>;
}
interface LocationPickerProps {
  currentUser: string;
  loginLocations: Array<LocationEntry>;
  onChangeLocation(locationUuid: string): void;
  searchLocations(
    query: string,
    ac: AbortController,
    useLoginLocationTag: boolean
  ): Promise<Array<LocationEntry>>;
  hideWelcomeMessage?: boolean;
  currentLocationUuid?: string;
  isLoginEnabled: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  currentUser,
  loginLocations,
  onChangeLocation,
  searchLocations,
  hideWelcomeMessage,
  currentLocationUuid,
  isLoginEnabled,
}) => {
  const config = useConfig();
  const { chooseLocation } = config;
  const { t } = useTranslation();
  const userDefaultLoginLocation: string = "userDefaultLoginLocationKey";
  const getDefaultUserLoginLocation = (): string => {
    const userLocation = window.localStorage.getItem(
      `${userDefaultLoginLocation}${currentUser}`
    );
    const isValidLocation = loginLocations.some(
      (location) => location.resource.id === userLocation
    );
    return isValidLocation ? userLocation : "";
  };
  const [locationData, setLocationData] = React.useState<LocationDataState>({
    activeLocation: getDefaultUserLoginLocation() ?? "",
    locationResult: loginLocations,
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [pageSize, setPageSize] = React.useState<number>(
    chooseLocation.numberToShow
  );
  const inputRef = React.useRef();

  const searchTimeout = 300;

  React.useEffect(() => {
    if (isSubmitting) {
      onChangeLocation(locationData.activeLocation);
      setIsSubmitting(false);
    }
  }, [isSubmitting, locationData, onChangeLocation]);

  React.useEffect(() => {
    const ac = new AbortController();

    if (loginLocations.length > 100) {
      if (searchTerm) {
        searchLocations(
          searchTerm,
          ac,
          chooseLocation.useLoginLocationTag
        ).then((locationResult) => {
          changeLocationData({
            locationResult,
          });
        }, createErrorHandler());
      }
    } else if (searchTerm) {
      filterList(searchTerm);
    } else if (loginLocations !== locationData.locationResult) {
      changeLocationData({ locationResult: loginLocations });
    }

    return () => ac.abort();
  }, [searchTerm, loginLocations]);

  const search = debounce((location: string) => {
    clearSelectedLocation();
    setSearchTerm(location);
  }, searchTimeout);

  const filterList = (searchTerm: string) => {
    if (searchTerm) {
      const updatedList = loginLocations.filter((item) => {
        return (
          item.resource.name.toLowerCase().search(searchTerm.toLowerCase()) !==
          -1
        );
      });

      changeLocationData({ locationResult: updatedList });
    }
  };

  const changeLocationData = (data: Partial<LocationDataState>) => {
    if (data) {
      setLocationData((prevState) => ({
        ...prevState,
        ...data,
      }));
    }
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
  };

  React.useEffect(() => {
    if (locationData.activeLocation) {
      window.localStorage.setItem(
        `${userDefaultLoginLocation}${currentUser}`,
        locationData.activeLocation
      );
    }
  }, [locationData.activeLocation, currentUser]);

  React.useEffect(() => {
    if (currentLocationUuid && hideWelcomeMessage) {
      setLocationData((prevState) => ({
        ...prevState,
        ...{
          activeLocation: currentLocationUuid,
          locationResult: prevState.locationResult,
        },
      }));
    }
  }, [currentLocationUuid, hideWelcomeMessage]);

  React.useEffect(() => {
    if (isSubmitting && inputRef.current) {
      let searchInput: HTMLInputElement = inputRef.current;
      searchInput.value = "";
      setSearchTerm(null);
    }
  }, [isSubmitting]);

  const clearSelectedLocation = (): void => {
    setLocationData((prevState) => ({
      activeLocation: "",
      locationResult: prevState.locationResult,
    }));
  };

  React.useEffect(() => {
    locationData.locationResult.length < pageSize
      ? setPageSize(locationData.locationResult.length)
      : setPageSize(chooseLocation.numberToShow);
  }, [locationData.locationResult.length]);

  return (
    <div className={styles["locationPickerContainer"]}>
      <form onSubmit={handleSubmit}>
        <div className={`${styles["location-card"]}`}>
          <div className={styles["welcomeContainer"]}>
            <p className={styles["welcomeTitle"]}>
              {t("welcome", "Welcome")} {currentUser}
            </p>
            <p className={styles["welcomeMessage"]}>
              {t(
                "selectYourLocation",
                "Select your location from the list below. Use the search bar to search for your location."
              )}
            </p>
          </div>
          <div>
            <Search
              labelText="Search for location"
              id="search-1"
              placeholder={t("searchForLocation", "Search for a location")}
              onChange={(ev) => search(ev.target.value)}
              autoFocus={true}
              name="searchForLocation"
            />
          </div>
          <div className={styles["searchResults"]}>
            <p>
              {searchTerm
                ? `${locationData.locationResult.length} ${
                    locationData.locationResult.length === 1
                      ? t("match", "match")
                      : t("matches", "matches")
                  } ${t("found", "found")}`
                : `${t("showing", "Showing")} ${pageSize} ${t("of", "of")} ${
                    locationData.locationResult.length
                  } ${t("locations", "locations")}`}
            </p>
          </div>
          <div className={styles["locationResultsContainer"]}>
            {!isEmpty(locationData.locationResult) && (
              <RadioButtonGroup
                valueSelected={locationData.activeLocation}
                orientation="vertical"
                name={locationData.activeLocation}
                onChange={(ev) => {
                  changeLocationData({ activeLocation: ev.toString() });
                }}
              >
                {locationData.locationResult.slice(0, pageSize).map((entry) => (
                  <RadioButton
                    className={styles["locationRadioButton"]}
                    key={entry.resource.id}
                    id={entry.resource.name}
                    labelText={entry.resource.name}
                    value={entry.resource.id}
                  />
                ))}
              </RadioButtonGroup>
            )}
            {locationData.locationResult.length === 0 && (
              <p className={styles["locationNotFound"]}>
                <Trans i18nKey="locationNotFound">
                  Sorry, no matching location was found
                </Trans>
              </p>
            )}
            <div className={styles["center"]}>
              <p className={styles["error-msg"]} />
            </div>
          </div>
          <div className={styles["confirmButton"]}>
            <Button
              kind="primary"
              type="submit"
              disabled={!locationData.activeLocation || !isLoginEnabled}
            >
              <Trans i18nKey="confirm">Confirm</Trans>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LocationPicker;
