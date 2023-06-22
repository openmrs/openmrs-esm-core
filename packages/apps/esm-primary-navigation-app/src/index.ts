import {
  defineConfigSchema,
  defineExtensionConfigSchema,
  getAsyncLifecycle,
  setupOfflineSync,
} from "@openmrs/esm-framework";
import { Application, navigateToUrl } from "single-spa";
import { configSchema } from "./config-schema";
import { moduleName, userPropertyChange } from "./constants";
import { syncUserLanguagePreference } from "./offline";
import { genericLinkConfigSchema } from "./components/generic-link/generic-link.component";

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const options = {
  featureName: "primary navigation",
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  defineExtensionConfigSchema("link", genericLinkConfigSchema);

  setupOfflineSync(userPropertyChange, [], syncUserLanguagePreference);
}

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const redirect: Application = async () => ({
  bootstrap: async () =>
    await navigateToUrl(window.getOpenmrsSpaBase() + "home"),
  mount: async () => undefined,
  unmount: async () => undefined,
});

export const userPanel = getAsyncLifecycle(
  () =>
    import(
      "./components/user-panel-switcher-item/user-panel-switcher.component"
    ),
  options
);

export const localeChanger = getAsyncLifecycle(
  () => import("./components/choose-locale/change-locale.component"),
  options
);

export const linkComponent = getAsyncLifecycle(
  () => import("./components/generic-link/generic-link.component"),
  {
    featureName: "Link",
    moduleName,
  }
);
