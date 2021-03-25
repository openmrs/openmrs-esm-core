import * as breadcrumbs from "./breadcrumbs";
import { getAsyncLifecycle } from "@openmrs/esm-framework";

export const appName = "@openmrs/esm-app-shell";

export function getCoreExtensions() {
  const options = {
    featureName: "app-shell",
    moduleName: appName,
  };

  return [
    {
      id: "breadcrumbs-widget",
      slot: "breadcrumbs-slot",
      load: getAsyncLifecycle(() => Promise.resolve(breadcrumbs), options),
    },
  ];
}
