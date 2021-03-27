import { getAsyncLifecycle } from "@openmrs/esm-framework";

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

const importTranslation = () => Promise.resolve();

export { importTranslation, setupOpenMRS };
