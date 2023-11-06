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

  const defaultLocation = useMemo(() => {
    return userProperties?.defaultLocation;
  }, [userProperties?.defaultLocation]);

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

  const updateUserPreference = useCallback(
    async (locationUuid: string, saveUserPreference: boolean) => {
      if (savePreference && locationUuid === defaultLocation) {
        return;
      }

      updateUserPropsWithPreference(locationUuid, saveUserPreference).then(
        () => {
          const isUpdateFlow =
            new URLSearchParams(location?.search).get("update") === "true";
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
        }
      );
    },
    [savePreference, defaultLocation, updateUserPropsWithPreference, t]
  );

  return {
    defaultLocation: isLocationValid ? defaultLocation : null,
    updateUserPreference,
    savePreference,
    setSavePreference,
  };
}
