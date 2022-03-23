import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  setupOfflineSync,
} from "@openmrs/esm-framework";
import {
  postUserPropertiesOnline,
  postUserPropertiesOffline,
} from "./components/choose-locale/change-locale.resource";
import { configSchema } from "./config-schema";
import { moduleName, userPropertyChange } from "./constants";
import HomeRedirect from "./home-redirect.component";
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
        order: 0,
      },
      {
        load: getSyncLifecycle(() => HomeRedirect(), options),
        route: (location: Location) =>
          location.pathname === window.getOpenmrsSpaBase(),
        online: true,
        offline: true,
        order: 0,
      },
    ],
    extensions: [
      {
        name: "default-user-panel",
        slot: "user-panel-slot",
        order: 0, // should be first DOM element
        load: getAsyncLifecycle(
          () =>
            import(
              "./components/user-panel-switcher-item/user-panel-switcher.component"
            ),
          options
        ),
        online: true,
        offline: true,
      },
      {
        name: "change-locale",
        slot: "user-panel-slot",
        order: 1,
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

export { setupOpenMRS, importTranslation, backendDependencies };
