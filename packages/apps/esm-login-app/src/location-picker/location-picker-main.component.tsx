import React, { useCallback } from "react";
import LocationPicker from "./location-picker.component";
import { useLoginLocations } from "../login.resource";
import {
  navigate,
  setSessionLocation,
  useConfig,
} from "@openmrs/esm-framework";
import { useLocation } from "react-router-dom";
import { LoginReferrer } from "../login/login.component";
import LoadingIcon from "../loading/loading.component";

interface LocationPickerMainProps {
  isLoginEnabled: boolean;
}

const LocationPickerMain: React.FC<LocationPickerMainProps> = ({
  isLoginEnabled,
}) => {
  const { chooseLocation, links } = useConfig();
  const { locations, isLoading } = useLoginLocations(
    chooseLocation.useLoginLocationTag,
    chooseLocation.locationsPerRequest
  );
  const { state } = useLocation() as { state: LoginReferrer };
  const returnToUrl = new URLSearchParams(location?.search).get("returnToUrl");
  const changeLocation = useCallback(
    (locationUuid?: string) => {
      const sessionDefined = locationUuid
        ? setSessionLocation(locationUuid, new AbortController())
        : Promise.resolve();

      sessionDefined.then(() => {
        if (
          state?.referrer &&
          !["/", "/login", "/login/location"].includes(state?.referrer)
        ) {
          navigate({ to: "${openmrsSpaBase}" + state?.referrer });
          return;
        }
        if (returnToUrl && returnToUrl !== "/") {
          navigate({ to: returnToUrl });
        } else {
          navigate({ to: links.loginSuccess });
        }
        return;
      });
    },
    [state?.referrer, returnToUrl, links.loginSuccess]
  );

  if (isLoading) {
    return <LoadingIcon />;
  }

  if (locations?.length === 1) {
    changeLocation(locations[0]?.resource.id);
    return;
  }

  return <LocationPicker isLoginEnabled={isLoginEnabled} />;
};

export default LocationPickerMain;
