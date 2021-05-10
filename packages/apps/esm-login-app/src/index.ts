import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { backendDependencies } from "./openmrs-backend-dependencies";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const sharedOnlineOfflineProps = {
  online: {
    isLoginEnabled: true,
  },
  offline: {
    isLoginEnabled: false,
  },
};

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-login-app";

  const options = {
    featureName: "login",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: "login",
        ...sharedOnlineOfflineProps,
      },
    ],
    extensions: [
      {
        id: "location-picker",
        slot: "location-picker",
        load: getAsyncLifecycle(
          () => import("./location-picker/location-picker.component"),
          options
        ),
        ...sharedOnlineOfflineProps,
      },
      {
        id: "location-changer",
        slot: "user-panel-slot",
        load: getAsyncLifecycle(
          () => import("./change-location-link/change-location-link.component"),
          options
        ),
        ...sharedOnlineOfflineProps,
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
