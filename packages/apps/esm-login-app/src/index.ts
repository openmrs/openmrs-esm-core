import { defineConfigSchema, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import rootComponent from './root.component';
import locationPickerViewComponent from './location-picker-view/location-picker-view.component';
import changeLocationLinkComponent from './change-location-link/change-location-link.extension';
import logoutButtonComponent from './logout/logout.extension';

const moduleName = '@openmrs/esm-login-app';

const options = {
  featureName: 'login',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const root = getSyncLifecycle(rootComponent, options);
export const locationPicker = getSyncLifecycle(locationPickerViewComponent, options);
export const logoutButton = getSyncLifecycle(logoutButtonComponent, options);
export const changeLocationLink = getSyncLifecycle(changeLocationLinkComponent, options);
