import {
  getAsyncLifecycle,
  registerBreadcrumbs,
  setupOfflineSync,
} from "@openmrs/esm-framework";
import { routes } from "./constants";
import { setupOffline } from "./offline";
import { setupSynchronizingOfflineActionsNotifications } from "./offline-actions/synchronizing-notification";

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  "webservices.rest": "^2.24.0",
  appui: "^1.9.0",
};

const frontendDependencies = {
  "@openmrs/esm-framework": process.env.FRAMEWORK_VERSION,
};

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-offline-tools-app";
  const options = {
    featureName: "offline-tools",
    moduleName,
  };

  setupOffline();
  setupSynchronizingOfflineActionsNotifications();

  setupOfflineSync("test", [], async (...args) => {
    await new Promise((res) => setTimeout(res, 1500));
    throw new Error("Server did not respond.");
  });

  // setupOfflineSync("test", [], async (...args) => {
  //   await new Promise((res) => setTimeout(res, 500));
  // });

  registerBreadcrumbs([
    {
      path: `${window.spaBase}${routes.offlineTools}`,
      title: "Offline tools",
      parent: `${window.spaBase}${routes.home}`,
    },
    {
      path: `${window.spaBase}${routes.offlineToolsPatients}`,
      title: "Offline patients",
      parent: `${window.spaBase}${routes.offlineTools}`,
    },
    {
      path: `${window.spaBase}${routes.offlineToolsPatientOfflineData}`,
      title: "Offline data",
      parent: `${window.spaBase}${routes.offlineToolsPatients}`,
    },
    {
      path: `${window.spaBase}${routes.offlineToolsActions}`,
      title: "Actions",
      parent: `${window.spaBase}${routes.offlineTools}`,
    },
  ]);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: "offline-tools",
        online: {
          canSynchronizeOfflineActions: true,
        },
        offline: {
          canSynchronizeOfflineActions: false,
        },
      },
    ],
    extensions: [
      {
        id: "offline-tools-link",
        slot: "app-menu-slot",
        load: getAsyncLifecycle(
          () => import("./offline-tools-link.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-nav-items",
        load: getAsyncLifecycle(
          () => import("./nav/offline-tools-nav-menu.component"),
          {
            featureName: "nav-items",
            moduleName,
          }
        ),
        online: true,
        offline: true,
      },
    ],
  };
}

export {
  setupOpenMRS,
  importTranslation,
  backendDependencies,
  frontendDependencies,
};
