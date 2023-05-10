import { getAsyncLifecycle } from "@openmrs/esm-framework";

export const importTranslation = () => Promise.resolve();

const options = {
  featureName: "devtools",
  moduleName: "@openmrs/esm-devtools-app",
};

export const devtools = getAsyncLifecycle(
  () => import("./devtools/devtools.component"),
  options
);
