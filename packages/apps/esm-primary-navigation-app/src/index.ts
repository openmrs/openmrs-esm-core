import {
  defineConfigSchema,
  defineExtensionConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  navigate,
  setupOfflineSync,
} from "@openmrs/esm-framework";
import { type Application } from "single-spa";
import { configSchema } from "./config-schema";
import { moduleName, userPropertyChange } from "./constants";
import { syncUserLanguagePreference } from "./offline";
import primaryNavRootComponent from "./root.component";
import userPanelComponent from "./components/user-panel-switcher-item/user-panel-switcher.component";
import localeChangerComponent from "./components/choose-locale/change-locale.component";
import genericLinkComponent, {
  genericLinkConfigSchema,
} from "./components/generic-link/generic-link.component";

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

export const root = getSyncLifecycle(primaryNavRootComponent, options);

export const redirect: Application = async () => ({
  bootstrap: async () => navigate({ to: "${openmrsSpaBase}/home" }),
  mount: async () => undefined,
  unmount: async () => undefined,
});

export const userPanel = getSyncLifecycle(userPanelComponent, options);

export const localeChanger = getSyncLifecycle(localeChangerComponent, options);

export const linkComponent = getSyncLifecycle(genericLinkComponent, {
  featureName: "Link",
  moduleName,
});
