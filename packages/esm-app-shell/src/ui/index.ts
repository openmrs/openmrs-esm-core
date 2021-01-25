import { getAsyncExtensionLifecycle } from "@openmrs/esm-react-utils";

export const appName = "@openmrs/esm-app-shell";

export function getCoreExtensions() {
  const options = {
    featureName: "app-shell",
    moduleName: appName,
  };

  return [
    {
      id: "breadcrumbs-widget",
      slot: "breadcrumbs",
      load: getAsyncExtensionLifecycle(() => import("./breadcrumbs"), options),
    },
  ];
}
