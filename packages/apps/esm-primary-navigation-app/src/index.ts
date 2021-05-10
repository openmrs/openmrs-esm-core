import { defineConfigSchema, getAsyncLifecycle } from "@openmrs/esm-framework";
import {
  postUserPropertiesOnline,
  postUserPropertiesOffline,
} from "./components/choose-locale/change-locale.resource";
import { configSchema } from "./config-schema";

const backendDependencies = { "webservices.rest": "^2.2.0" };

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const moduleName = "@openmrs/esm-primary-navigation-app";
const options = {
  featureName: "primary navigation",
  moduleName,
};

function setupOpenMRS() {
  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: (location: Location) =>
          !location.pathname.startsWith(window.getOpenmrsSpaBase() + "login"),
        online: { syncUserPropertiesChangesOnLoad: true },
        offline: { syncUserPropertiesChangesOnLoad: false },
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

export { backendDependencies, importTranslation, setupOpenMRS };
