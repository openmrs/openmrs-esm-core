import React, { useState, useCallback, useEffect } from "react";
import LoadingIcon from "../loading/loading.component";
import LocationPicker from "../location-picker/location-picker.component";
import { RouteComponentProps } from "react-router-dom";
import { navigate, useConfig } from "@openmrs/esm-framework";
import { setSessionLocation, queryLocations } from "./choose-location.resource";
import { useCurrentUser } from "../CurrentUserContext";
import { LocationEntry } from "../types";
import type { StaticContext } from "react-router";

export interface LoginReferrer {
  referrer?: string;
}

export interface ChooseLocationProps
  extends RouteComponentProps<{}, StaticContext, LoginReferrer> {
  isLoginEnabled: boolean;
}

export const ChooseLocation: React.FC<ChooseLocationProps> = ({
  location,
  isLoginEnabled,
}) => {
  const returnToUrl = new URLSearchParams(location?.search).get("returnToUrl");
  const referrer = location?.state?.referrer;
  const config = useConfig();
  const user = useCurrentUser();
  const [loginLocations, setLoginLocations] =
    useState<Array<LocationEntry>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const changeLocation = useCallback(
    (locationUuid?: string) => {
      const sessionDefined = locationUuid
        ? setSessionLocation(locationUuid, new AbortController())
        : Promise.resolve();

      sessionDefined.then(() => {
        if (referrer && referrer !== "/") {
          navigate({ to: "${openmrsSpaBase}" + referrer });
        }
        if (returnToUrl && returnToUrl !== "/") {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: config.links.loginSuccess });
        }
      });
    },
    [referrer, config.links.loginSuccess, returnToUrl]
  );

  useEffect(() => {
    if (isLoginEnabled) {
      const ac = new AbortController();
      queryLocations("", ac, config.chooseLocation.useLoginLocationTag).then(
        (locations) => setLoginLocations(locations)
      );
      return () => ac.abort();
    }
  }, [isLoginEnabled]);

  useEffect(() => {
    if (loginLocations) {
      if (!config.chooseLocation.enabled || loginLocations.length < 2) {
        changeLocation(loginLocations[0]?.resource.id);
      } else {
        setIsLoading(false);
      }
    }
  }, [loginLocations, user, changeLocation, config.chooseLocation.enabled]);

  if (!isLoading || !isLoginEnabled) {
    return (
      <LocationPicker
        currentUser={user.display}
        loginLocations={loginLocations ?? []}
        onChangeLocation={changeLocation}
        searchLocations={queryLocations}
        isLoginEnabled={isLoginEnabled}
      />
    );
  }

  return <LoadingIcon />;
};

export default ChooseLocation;
