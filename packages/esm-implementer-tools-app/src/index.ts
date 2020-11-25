import { getAsyncLifecycle } from "@openmrs/esm-react-utils";

function setupOpenMRS() {
  return {
    lifecycle: getAsyncLifecycle(
      () => import("./implementer-tools.component"),
      {
        featureName: "Implementer Tools",
        moduleName: "@openmrs/esm-implementer-tools-app",
      }
    ),
    activate: () => true,
  };
}

const importTranslation = () => Promise.resolve();

export { setupOpenMRS, importTranslation };

export { default as ConfigEditButton } from "./config-edit-button/config-edit-button.component";
