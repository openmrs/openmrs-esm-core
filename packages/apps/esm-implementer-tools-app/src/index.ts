import { getAsyncLifecycle } from "@openmrs/esm-framework";

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const moduleName = "@openmrs/esm-implementer-tools-app";
const options = {
  featureName: "Implementer Tools",
  moduleName,
};

export const implementerTools = getAsyncLifecycle(
  () => import("./implementer-tools.component"),
  options
);

export const globalImplementerTools = getAsyncLifecycle(
  () => import("./global-implementer-tools.component"),
  options
);

export const implementerToolsButton = getAsyncLifecycle(
  () => import("./implementer-tools.button"),
  options
);

export { default as ConfigEditButton } from "./config-edit-button/config-edit-button.component";
