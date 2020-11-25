import { getAsyncLifecycle } from "@openmrs/esm-react-utils";

declare global {
  interface Window {
    spaEnv: "production" | "development" | "test";
  }
}

function setupOpenMRS() {
  return {
    lifecycle: getAsyncLifecycle(
      () => import("./devtools/devtools.component"),
      {
        featureName: "devtools",
        moduleName: "@openmrs/esm-devtools-app",
      }
    ),
    activate: () =>
      window.spaEnv === "development" ||
      !!localStorage.getItem("openmrs:devtools"),
  };
}

const importTranslation = () => Promise.resolve();

export { importTranslation, setupOpenMRS };
