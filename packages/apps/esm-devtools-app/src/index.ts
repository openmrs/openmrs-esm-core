import { getAsyncLifecycle } from "@openmrs/esm-framework";

declare var __VERSION__: string;
const version = __VERSION__;

const importTranslation = () => Promise.resolve();

function setupOpenMRS() {
  const options = {
    featureName: "devtools",
    moduleName: "@openmrs/esm-devtools-app",
  };

  return {
    lifecycle: getAsyncLifecycle(
      () => import("./devtools/devtools.component"),
      options
    ),
    activate: () =>
      window.spaEnv === "development" ||
      !!localStorage.getItem("openmrs:devtools"),
  };
}

export { setupOpenMRS, importTranslation, version };
