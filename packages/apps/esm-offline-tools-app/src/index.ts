import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
  registerBreadcrumbs,
} from "@openmrs/esm-framework";
import { routes } from "./constants";
import { createDashboardLink } from "./createDashboardLink";
import { dashboardMeta } from "./dashboard.meta";
import OfflineToolsNavLink from "./nav/offline-tools-nav-link.component";
import { setupOffline } from "./offline";
import { setupSynchronizingOfflineActionsNotifications } from "./offline-actions/synchronizing-notification";

declare var __VERSION__: string;
// __VERSION__ is replaced by Webpack with the version from package.json
const version = __VERSION__;

const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const backendDependencies = {
  "webservices.rest": "^2.24.0",
};

function setupOpenMRS() {
  const moduleName = "@openmrs/esm-offline-tools-app";
  const options = {
    featureName: "offline-tools",
    moduleName,
  };

  defineConfigSchema(moduleName, {});
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
        name: "offline-tools-link",
        slot: "app-menu-slot",
        load: getAsyncLifecycle(
          () => import("./offline-tools-app-menu-link.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        name: "offline-tools-nav-items",
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
        name: "offline-tools-confirmation-modal",
        load: getAsyncLifecycle(
          () => import("./components/confirmation-modal.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        name: "offline-tools-dashboard-patients-card",
        slot: "offline-tools-dashboard-cards",
        load: getAsyncLifecycle(
          () => import("./offline-patients/patients-overview-card.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        name: "offline-tools-dashboard-actions-card",
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
        name: "offline-tools-page-offline-patients-link",
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
        name: "offline-tools-page-offline-patients",
        slot: "offline-tools-page-offline-patients-slot",
        load: getAsyncLifecycle(
          () => import("./offline-patients/offline-patients.component"),
          options
        ),
        online: true,
        offline: true,
      },
      {
        name: "offline-tools-page-actions-link",
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
        name: "offline-tools-page-actions",
        slot: "offline-tools-page-actions-slot",
        load: getAsyncLifecycle(
          () => import("./offline-actions/offline-actions-page.component"),
          options
        ),
        online: {
          canSynchronizeOfflineActions: true,
        },
        offline: {
          canSynchronizeOfflineActions: false,
        },
      },
      {
        id: "offline-tools-patient-chart-actions-widget",
        slot: "patient-chart-summary-dashboard-slot",
        order: 0,
        load: getAsyncLifecycle(
          () =>
            import(
              "./offline-actions/offline-actions-patient-chart-widget.component"
            ),
          options
        ),
        meta: {
          columnSpan: 4,
        },
        online: false,
        offline: true,
      },
      {
        id: "offline-tools-patient-chart-actions-dashboard",
        order: 0,
        slot: dashboardMeta.slot,
        load: getAsyncLifecycle(
          () =>
            import(
              "./offline-actions/offline-actions-patient-chart-widget.component"
            ),
          options
        ),
        online: true,
        offline: true,
      },
      {
        id: "offline-tools-patient-chart-actions-dashboard-link",
        slot: "patient-chart-dashboard-slot",
        order: 12,
        load: getSyncLifecycle(createDashboardLink(dashboardMeta), options),
        meta: dashboardMeta,
        online: true,
        offline: true,
      },
      {
        name: "offline-tools-opt-in-offline-mode-button",
        slot: "user-panel-slot",
        order: 1,
        load: getAsyncLifecycle(
          () =>
            import("./offline-actions/offline-actions-mode-button.component"),
          options
        ),
        online: true,
        offline: false,
      },
    ],
  };
}

export { setupOpenMRS, importTranslation, backendDependencies, version };
