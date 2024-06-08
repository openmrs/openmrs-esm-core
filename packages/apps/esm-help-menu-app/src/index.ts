import { getAsyncLifecycle } from '@openmrs/esm-framework';

export const importTranslation = () => Promise.resolve();

const options = {
  featureName: 'help-menu',
  moduleName: '@openmrs/esm-help-menu-app',
};

export const helpMenu = getAsyncLifecycle(() => import('./helpMenu/help.component'), options);
