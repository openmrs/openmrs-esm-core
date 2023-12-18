import { getSyncLifecycle } from '@openmrs/esm-framework';
import implementerToolsComponent from './implementer-tools.component';
import globalImplementerToolsComponent from './global-implementer-tools.component';
import implementerToolsButtonComponent from './implementer-tools.button';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const moduleName = '@openmrs/esm-implementer-tools-app';
const options = {
  featureName: 'Implementer Tools',
  moduleName,
};

export const implementerTools = getSyncLifecycle(implementerToolsComponent, options);

export const globalImplementerTools = getSyncLifecycle(globalImplementerToolsComponent, options);

export const implementerToolsButton = getSyncLifecycle(implementerToolsButtonComponent, options);

export { default as ConfigEditButton } from './config-edit-button/config-edit-button.component';
