import { defineConfigSchema, getSyncLifecycle, registerBreadcrumbs } from '@openmrs/esm-framework';
import { routes } from './constants';
import { createDashboardLink } from './createDashboardLink';
import { dashboardMeta } from './dashboard.meta';
import { setupOffline } from './offline';
import { setupSynchronizingOfflineActionsNotifications } from './offline-actions/synchronizing-notification';
import offlineToolsComponent from './root.component';
import offlineToolsLinkComponent from './offline-tools-app-menu-link.component';
import offlineToolsNavItemsComponent from './nav/offline-tools-nav-menu.component';
import offlineToolsConfirmationModalComponent from './components/confirmation.modal';
import offlineToolsPatientsCardComponent from './offline-patients/patients-overview-card.component';
import offlineToolsActionsCardComponent from './offline-actions/offline-actions-overview-card.component';
import offlineToolsActionsComponent from './offline-actions/offline-actions.component';
import offlineToolsPatientsComponent from './offline-patients/offline-patients.component';
import offlineToolsPageActionsComponent from './offline-actions/offline-actions-page.component';
import offlineToolsPatientChartComponent from './offline-actions/offline-actions-patient-chart-widget.component';
import offlineToolsOptInButtonComponent from './offline-actions/offline-actions-mode-button.extension';
import OfflineToolsNavLink from './nav/offline-tools-nav-link.component';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@openmrs/esm-offline-tools-app';
const options = {
  featureName: 'offline-tools',
  moduleName,
};

export const offlineTools = getSyncLifecycle(offlineToolsComponent, options);

export const offlineToolsLink = getSyncLifecycle(offlineToolsLinkComponent, options);

export const offlineToolsNavItems = getSyncLifecycle(offlineToolsNavItemsComponent, {
  featureName: 'nav-items',
  moduleName,
});

export const offlineToolsConfirmationModal = getSyncLifecycle(offlineToolsConfirmationModalComponent, options);

export const offlineToolsPatientsCard = getSyncLifecycle(offlineToolsPatientsCardComponent, options);

export const offlineToolsActionsCard = getSyncLifecycle(offlineToolsActionsCardComponent, options);

export const offlineToolsPatientsLink = getSyncLifecycle(
  () =>
    OfflineToolsNavLink({
      page: 'patients',
      title: 'offlinePatients',
    }),
  options,
);

export const offlineToolsActionsLink = getSyncLifecycle(
  () =>
    OfflineToolsNavLink({
      page: 'actions',
      title: 'offlineActions',
    }),
  options,
);

export const offlineToolsActions = getSyncLifecycle(offlineToolsActionsComponent, options);

export const offlineToolsPatients = getSyncLifecycle(offlineToolsPatientsComponent, options);

export const offlineToolsPageActions = getSyncLifecycle(offlineToolsPageActionsComponent, options);

export const offlineToolsPatientChartActions = getSyncLifecycle(offlineToolsPatientChartComponent, options);

export const offlineToolsPatientChartActionsDashboardLink = getSyncLifecycle(
  createDashboardLink({
    ...dashboardMeta,
    // t('offline_actions_link', 'Offline Actions')
    title: () =>
      Promise.resolve(
        window.i18next?.t('offline_actions_link', {
          defaultValue: 'Offline Actions',
          ns: moduleName,
        }) ?? 'Offline Actions',
      ),
  }),
  options,
);

export const offlineToolsOptInButton = getSyncLifecycle(offlineToolsOptInButtonComponent, options);

export function startupApp() {
  defineConfigSchema(moduleName, {});
  setupOffline();
  setupSynchronizingOfflineActionsNotifications();

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/${routes.offlineTools}`,
      title: 'Offline Tools',
      parent: `${window.spaBase}/${routes.home}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsPatients}`,
      title: 'Patients',
      parent: `${window.spaBase}/${routes.offlineTools}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsPatientOfflineData}`,
      title: 'Data',
      parent: `${window.spaBase}/${routes.offlineToolsPatients}`,
    },
    {
      path: `${window.spaBase}/${routes.offlineToolsActions}`,
      title: 'Actions',
      parent: `${window.spaBase}/${routes.offlineTools}`,
    },
  ]);
}
