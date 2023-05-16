import { getAsyncLifecycle } from "@openmrs/esm-framework";

export const appName = "@openmrs/esm-app-shell";

export function getCoreExtensions() {
  const options = {
    featureName: "app-shell",
    moduleName: appName,
  };

  return [
    {
      name: "breadcrumbs-widget",
      slot: "breadcrumbs-slot",
      load: getAsyncLifecycle(() => import("./breadcrumbs"), options),
      online: true,
      offline: true,
    },
  ];
}
