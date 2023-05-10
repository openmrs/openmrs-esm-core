import { getAsyncLifecycle, defineConfigSchema } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const moduleName = "@openmrs/esm-login-app";

const options = {
  featureName: "login",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getAsyncLifecycle(
  () => import("./root.component"),
  options
);
export const locationPicker = getAsyncLifecycle(
  () => import("./location-picker/location-picker.component"),
  options
);
export const logoutButton = getAsyncLifecycle(
  () => import("./logout/logout.component"),
  options
);
export const changeLocationLink = getAsyncLifecycle(
  () => import("./change-location-link/change-location-link.component"),
  options
);
