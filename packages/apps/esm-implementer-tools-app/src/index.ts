import { getAsyncLifecycle } from "@openmrs/esm-framework";

declare var __VERSION__: string;
const version = __VERSION__;

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-implementer-tools-app";
  const options = {
    featureName: "Implementer Tools",
    moduleName,
  };

  return {
    pages: [
      {
        route: () => true,
        load: getAsyncLifecycle(
          () => import("./implementer-tools.component"),
          options
        ),
      },
      {
        route: () => true,
        load: getAsyncLifecycle(
          () => import("./global-implementer-tools.component"),
          options
        ),
      },
    ],
    extensions: [
      {
        name: "implementer-tools-button",
        slot: "top-nav-actions-slot",
        load: getAsyncLifecycle(
          () => import("./implementer-tools.button"),
          options
        ),
      },
    ],
  };
}

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export { setupOpenMRS, importTranslation, version };
export { default as ConfigEditButton } from "./config-edit-button/config-edit-button.component";
