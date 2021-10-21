import { getAsyncLifecycle } from "@openmrs/esm-framework";

const importTranslation = () => Promise.resolve();

const frontendDependencies = {
  "@openmrs/esm-framework": process.env.FRAMEWORK_VERSION,
};

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

function nothing() {
  const thisIs = "a test change";
}

export { setupOpenMRS, importTranslation, frontendDependencies };
