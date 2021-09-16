import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  "webservices.rest": "^2.24.0",
  appui: "^1.9.0",
};

const frontendDependencies = {
  "@openmrs/esm-framework": process.env.FRAMEWORK_VERSION,
};

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
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: "logout",
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
        id: "logout-button",
        slot: "user-panel-actions-slot",
        load: getAsyncLifecycle(
          () => import("./logout/logout.component"),
          options
        ),
        online: true,
        offline: false,
      },
      {
        id: "location-changer",
        slot: "user-panel-slot",
        order: 1,
        load: getAsyncLifecycle(
          () => import("./change-location-link/change-location-link.component"),
          options
        ),
        ...sharedOnlineOfflineProps,
      },
    ],
  };
}

export {
  setupOpenMRS,
  importTranslation,
  backendDependencies,
  frontendDependencies,
};
