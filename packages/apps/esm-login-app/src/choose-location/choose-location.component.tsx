import React, { useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  navigate,
  useConfig,
  setSessionLocation,
  useSession,
} from "@openmrs/esm-framework";
import { useLoginLocations } from "./choose-location.resource";
import LoadingIcon from "../loading/loading.component";
import LocationPicker from "../location-picker/location-picker.component";

export interface LoginReferrer {
  referrer?: string;
}

export interface ChooseLocationProps extends LoginReferrer {
  isLoginEnabled: boolean;
}

export const ChooseLocation: React.FC<ChooseLocationProps> = ({
  isLoginEnabled,
}) => {
  const { state } = useLocation() as { state: LoginReferrer };
  const returnToUrl = new URLSearchParams(location?.search).get("returnToUrl");
  const referrer = state?.referrer;
  const config = useConfig();
  const { user } = useSession();
  const { locationData, isLoading } = useLoginLocations(
    config.chooseLocation.useLoginLocationTag
  );

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

  // Handle cases where the location picker is disabled, there is only one
  // location, or there are no locations.
  useEffect(() => {
    if (!isLoading) {
      if (!config.chooseLocation.enabled || locationData?.length === 1) {
        changeLocation(locationData[0]?.resource.id);
      }
      if (!isLoading && !locationData?.length) {
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

  if (!isLoading && !user) {
    navigate({ to: "${openmrsSpaBase}/login" });
    return null;
  }

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
