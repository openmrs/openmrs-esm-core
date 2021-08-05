import {
  defineConfigSchema,
  getAsyncLifecycle,
  setupOfflineSync,
} from "@openmrs/esm-framework";
import {
  postUserPropertiesOnline,
  postUserPropertiesOffline,
} from "./components/choose-locale/change-locale.resource";
import { configSchema } from "./config-schema";
import { moduleName, userPropertyChange } from "./constants";
import { syncUserLanguagePreference } from "./offline";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  "webservices.rest": "^2.2.0",
};

const frontendDependencies = {
  "@openmrs/esm-framework": process.env.FRAMEWORK_VERSION,
};

const options = {
  featureName: "primary navigation",
  moduleName,
};

function setupOpenMRS() {
  defineConfigSchema(moduleName, configSchema);

  setupOfflineSync(userPropertyChange, [], syncUserLanguagePreference);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: (location: Location) =>
          !location.pathname.startsWith(window.getOpenmrsSpaBase() + "login"),
        online: true,
        offline: true,
      },
    ],
    extensions: [
      {
        id: "default-user-panel",
        slot: "user-panel-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./components/user-panel-switcher-item/user-panel-switcher.component"
            ),
          options
        ),
        online: {
          isLogoutEnabled: true,
        },
        offline: {
          isLogoutEnabled: false,
        },
      },
      {
        id: "change-locale",
        slot: "user-panel-slot",
        load: getAsyncLifecycle(
          () => import("./components/choose-locale/change-locale.component"),
          options
        ),
        online: {
          postUserProperties: postUserPropertiesOnline,
        },
        offline: {
          postUserProperties: postUserPropertiesOffline,
        },
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
