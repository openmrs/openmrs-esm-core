import React, { useCallback, useEffect } from "react";
import LoadingIcon from "../loading/loading.component";
import LocationPicker from "../location-picker/location-picker.component";
import { RouteComponentProps } from "react-router-dom";
import {
  navigate,
  useConfig,
  setSessionLocation,
} from "@openmrs/esm-framework";
import { useLocationPicker } from "./choose-location.resource";
import { useCurrentUser } from "../CurrentUserContext";
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
  const { locationData, isLoading } = useLocationPicker(
    config.chooseLocation.useLoginLocationTag
  );

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
    if (!isLoading) {
      if (!config.chooseLocation.enabled || locationData.length === 1) {
        changeLocation(locationData[0]?.resource.id);
      }
      if (!isLoading && !locationData.length) {
        changeLocation();
      }
    }
  }, [
    locationData,
    user,
    changeLocation,
    config.chooseLocation.enabled,
    isLoading,
  ]);

  console.log(isLoading, locationData);

  if (!isLoading || !isLoginEnabled) {
    return (
      <LocationPicker
        currentUser={user.display}
        loginLocations={locationData ?? []}
        onChangeLocation={changeLocation}
        isLoginEnabled={isLoginEnabled}
      />
    );
  }

  return <LoadingIcon />;
};

export default ChooseLocation;
