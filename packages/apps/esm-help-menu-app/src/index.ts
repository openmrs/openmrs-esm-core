import { getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import Help from './helpMenu/help.component';
export const importTranslation = () => Promise.resolve();

const options = {
  featureName: 'help-menu',
  moduleName: '@openmrs/esm-help-menu-app',
};

export const helpMenu = getAsyncLifecycle(() => import('./helpMenu/help.component'), options);
export const help = getSyncLifecycle(Help, options);
