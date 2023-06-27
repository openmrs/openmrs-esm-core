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

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

const moduleName = "@openmrs/esm-offline-tools-app";
const options = {
  featureName: "offline-tools",
  moduleName,
};

export const offlineTools = getAsyncLifecycle(
  () => import("./root.component"),
  options
);

export const offlineToolsLink = getAsyncLifecycle(
  () => import("./offline-tools-app-menu-link.component"),
  options
);

export const offlineToolsNavItems = getAsyncLifecycle(
  () => import("./nav/offline-tools-nav-menu.component"),
  {
    featureName: "nav-items",
    moduleName,
  }
);

export const offlineToolsConfirmationModal = getAsyncLifecycle(
  () => import("./components/confirmation-modal.component"),
  options
);

export const offlineToolsPatientsCard = getAsyncLifecycle(
  () => import("./offline-patients/patients-overview-card.component"),
  options
);

export const offlineToolsActionsCard = getAsyncLifecycle(
  () => import("./offline-actions/offline-actions-overview-card.component"),
  options
);

export const offlineToolsPatientsLink = getSyncLifecycle(
  () =>
    OfflineToolsNavLink({
      page: "patients",
      title: "Patients",
    }),
  options
);

export const offlineToolsPatients = getAsyncLifecycle(
  () => import("./offline-patients/offline-patients.component"),
  options
);

export const offlineToolsPageActions = getAsyncLifecycle(
  () => import("./offline-actions/offline-actions-page.component"),
  options
);

export const offlineToolsPatientChartActions = getAsyncLifecycle(
  () =>
    import("./offline-actions/offline-actions-patient-chart-widget.component"),
  options
);

export const offlineToolsPatientChartActionsDashboard = getAsyncLifecycle(
  () =>
    import("./offline-actions/offline-actions-patient-chart-widget.component"),
  options
);

export const offlineToolsPatientChartActionsDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...dashboardMeta,
    // t('offline_actions_link', 'Offline Actions')
    title: () =>
      Promise.resolve(
        window.i18next?.t("offline_actions_link", {
          defaultValue: "Offline Actions",
          ns: moduleName,
        }) ?? "Offline Actions"
      ),
  }),
  options
);

export const offlineToolsOptInButton = getAsyncLifecycle(
  () => import("./offline-actions/offline-actions-mode-button.component"),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, {});
  setupOffline();
  setupSynchronizingOfflineActionsNotifications();

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/${routes.offlineTools}`,
      title: "Offline Tools",
      parent: `${window.spaBase}/${routes.home}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsPatients}`,
      title: "Patients",
      parent: `${window.spaBase}/${routes.offlineTools}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsPatientOfflineData}`,
      title: "Data",
      parent: `${window.spaBase}/${routes.offlineToolsPatients}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsActions}`,
      title: "Actions",
      parent: `${window.spaBase}/${routes.offlineTools}`,
    },
  ]);
}
