import {
  getAsyncLifecycle,
  getSyncLifecycle,
  registerBreadcrumbs,
} from "@openmrs/esm-framework";
import { routes } from "./constants";
import OfflineToolsNavLink from "./nav/offline-tools-nav-link.component";
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

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/${routes.offlineTools}`,
      title: "Offline tools",
      parent: `${window.spaBase}/${routes.home}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsPatients}`,
      title: "Offline patients",
      parent: `${window.spaBase}/${routes.offlineTools}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsPatientOfflineData}`,
      title: "Offline data",
      parent: `${window.spaBase}/${routes.offlineToolsPatients}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsActions}`,
      title: "Actions",
      parent: `${window.spaBase}/${routes.offlineTools}`,
    },
  ]);

  return {
    pages: [
      {
        load: getAsyncLifecycle(() => import("./root.component"), options),
        route: "offline-tools",
        online: true,
        offline: true,
      },
    ],
    extensions: [
      {
        id: "offline-tools-link",
        slot: "app-menu-slot",
        load: getAsyncLifecycle(
          () => import("./offline-tools-app-menu-link.component"),
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
      {
        id: "offline-tools-confirmation-modal",
        load: getAsyncLifecycle(
          () => import("./components/confirmation-modal.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-dashboard-patients-card",
        slot: "offline-tools-dashboard-cards",
        load: getAsyncLifecycle(
          () => import("./offline-patients/patients-overview-card.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-dashboard-actions-card",
        slot: "offline-tools-dashboard-cards",
        load: getAsyncLifecycle(
          () =>
            import("./offline-actions/offline-actions-overview-card.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-page-offline-patients-link",
        slot: "offline-tools-page-slot",
        load: getSyncLifecycle(
          () =>
            OfflineToolsNavLink({
              page: "patients",
              title: "Offline patients",
            }),
          options
        ),
        meta: {
          name: "patients",
          slot: "offline-tools-page-offline-patients-slot",
        },
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-page-offline-patients",
        slot: "offline-tools-page-offline-patients-slot",
        load: getAsyncLifecycle(
          () => import("./offline-patients/offline-patients.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-page-actions-link",
        slot: "offline-tools-page-slot",
        load: getSyncLifecycle(
          () =>
            OfflineToolsNavLink({ page: "actions", title: "Offline actions" }),
          options
        ),
        meta: {
          name: "actions",
          slot: "offline-tools-page-actions-slot",
        },
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-page-actions",
        slot: "offline-tools-page-actions-slot",
        load: getAsyncLifecycle(
          () => import("./offline-actions/offline-actions.component"),
          options
        ),
        online: {
          canSynchronizeOfflineActions: true,
        },
        offline: {
          canSynchronizeOfflineActions: false,
        },
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
