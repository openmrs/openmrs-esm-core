import { defineConfigSchema, getAsyncLifecycle } from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";

const importTranslation = () => Promise.resolve();

const frontendDependencies = {
  "@openmrs/esm-framework": process.env.FRAMEWORK_VERSION,
};

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-implementer-tools-app";
  const options = {
    featureName: "Implementer Tools",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  return {
    pages: [
      {
        route: () => true,
        load: getAsyncLifecycle(
          () => import("./implementer-tools.component"),
          options
        ),
      },
    ],
    extensions: [
      {
        id: "implementer-tools-button",
        slot: "top-nav-actions-slot",
        load: getAsyncLifecycle(
          () => import("./implementer-tools.button"),
          options
        ),
      },
    ],
  };
}

export { setupOpenMRS, importTranslation, frontendDependencies };
