import {
  getAsyncLifecycle,
  defineConfigSchema,
  registerBreadcrumbs,
} from "@openmrs/esm-framework";

import { configSchema } from "./config-schema";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-system-admin-app";

  const options = {
    featureName: "system-administration",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/system-administration`,
      title: "System Admninistration",
      parent: `${window.spaBase}/home`,
    },
  ]);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: "system-administration",
      },
    ],
    extensions: [
      {
        id: "system-administration-app-menu-link",
        slot: "app-menu-slot",
        load: getAsyncLifecycle(
          () => import("./system-admin-app-menu-link.component"),
          options
        ),
        online: true,
        offline: true,
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
