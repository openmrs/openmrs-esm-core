import {
  defineConfigSchema,
  defineExtensionConfigSchema,
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
import { navigateToUrl } from "single-spa";
import { genericLinkConfigSchema } from "./components/generic-link/generic-link.component";

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
  defineExtensionConfigSchema("link", genericLinkConfigSchema);

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
        load: {
          bootstrap: () =>
            Promise.resolve(navigateToUrl(window.getOpenmrsSpaBase() + "home")),
          mount: () => Promise.resolve(),
          unmount: () => Promise.resolve(),
        },
        route: (location: Location) =>
          location.pathname === window.getOpenmrsSpaBase(),
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
      {
        name: "link",
        load: getAsyncLifecycle(
          () => import("./components/generic-link/generic-link.component"),
          {
            featureName: "Link",
            moduleName,
          }
        ),
      },
    ],
  };
}

export { setupOpenMRS, importTranslation, backendDependencies };
