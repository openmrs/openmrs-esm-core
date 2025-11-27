import { getAsyncLifecycle } from '@openmrs/esm-framework';

const options = {
  featureName: 'devtools',
  moduleName: '@openmrs/esm-devtools-app',
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export const devtools = getAsyncLifecycle(() => import('./devtools/devtools.component'), options);

export const importmapOverrideModal = getAsyncLifecycle(
  () => import('./devtools/import-map-list/import-map.modal'),
  options,
);
