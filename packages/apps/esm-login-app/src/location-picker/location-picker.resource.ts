import {
  setUserProperties,
  showToast,
  useConfig,
  useSession,
} from "@openmrs/esm-framework";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigSchema } from "../config-schema";
import { useValidateLocationUuid } from "../login.resource";

const isUpdateFlow =
  new URLSearchParams(location?.search).get("update") === "true";

export function useDefaultLocation() {
  const { t } = useTranslation();
  const [savePreference, setSavePreference] = useState(false);
  const { user } = useSession();
  const { userUuid, userProperties } = useMemo(
    () => ({
      userUuid: user?.uuid,
      userProperties: user?.userProperties,
    }),
    [user]
  );
  const {
    chooseLocation: { saveLocationPreference },
  } = useConfig() as ConfigSchema;
  const {
    savePreferenceAsUserProp,
    savePreferenceOnComputer,
    savingPreferenceAllowed,
  } = useMemo(
    () => ({
      savingPreferenceAllowed: !!saveLocationPreference?.includes("none"),
      savePreferenceOnComputer:
        !!saveLocationPreference?.includes("localStorage"),
      savePreferenceAsUserProp: !!saveLocationPreference?.includes("userProp"),
    }),
    [saveLocationPreference]
  );

  const defaultLocation = useMemo(() => {
    let defaultLocation: string = null;
    if (!savingPreferenceAllowed) {
      return null;
    }

    if (savePreferenceOnComputer) {
      defaultLocation = localStorage.getItem("defaultLocation");
    }

    if (savePreferenceAsUserProp) {
      defaultLocation = userProperties?.defaultLocation;
    }

    return defaultLocation;
  }, [
    savePreferenceAsUserProp,
    savePreferenceOnComputer,
    savingPreferenceAllowed,
    userProperties?.defaultLocation,
  ]);

  const { isLocationValid } = useValidateLocationUuid(defaultLocation);

  useEffect(() => {
    if (defaultLocation) {
      setSavePreference(true);
    }
  }, [setSavePreference, defaultLocation]);

  const updateUserPropsWithPreference = useCallback(
    async (locationUuid: string, saveUserPreference: boolean) => {
      if (saveUserPreference) {
        // If the user checks the checkbox for saving the preference
        const updatedUserProperties = {
          ...userProperties,
          defaultLocation: locationUuid,
        };
        await setUserProperties(userUuid, updatedUserProperties);
      } else if (!!userProperties?.defaultLocation) {
        // If the user doesn't want to save the preference,
        // the old preference should be deleted
        delete userProperties.defaultLocation;
        await setUserProperties(userUuid, userProperties);
      }
    },
    [userProperties, userUuid]
  );

  const updateUserPreferenceOnComputer = useCallback(
    (locationUuid: string, saveUserPreference: boolean) => {
      if (saveUserPreference) {
        // If the user checks the checkbox for saving the preference
        localStorage.setItem("defaultLocation", locationUuid);
      } else if (!!localStorage.getItem("defaultLocation")) {
        // If the user doesn't want to save the preference,
        // the old preference should be deleted
        localStorage.removeItem("defaultLocation");
      }
    },
    []
  );

  const updateUserPreference = useCallback(
    async (locationUuid: string, saveUserPreference: boolean) => {
      if (!savingPreferenceAllowed) {
        return;
      }

      if (savePreference && locationUuid === defaultLocation) {
        return;
      }

      if (savePreferenceOnComputer) {
        updateUserPreferenceOnComputer(locationUuid, saveUserPreference);
      }

      if (savePreferenceAsUserProp) {
        await updateUserPropsWithPreference(locationUuid, saveUserPreference);
      }

      if (saveUserPreference) {
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
      } else {
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
      }
    },
    [
      savingPreferenceAllowed,
      savePreference,
      defaultLocation,
      savePreferenceOnComputer,
      savePreferenceAsUserProp,
      updateUserPreferenceOnComputer,
      updateUserPropsWithPreference,
      t,
    ]
  );

  return {
    defaultLocation:
      savingPreferenceAllowed && isLocationValid ? defaultLocation : null,
    savingPreferenceAllowed,
    updateUserPreference,
    savePreference,
    setSavePreference,
  };
}
