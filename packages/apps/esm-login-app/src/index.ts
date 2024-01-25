import { defineConfigSchema, getSyncLifecycle, registerBreadcrumbs } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import rootComponent from './root.component';
import locationPickerComponent from './location-picker/location-picker.component';
import changeLocationLinkComponent from './change-location-link/change-location-link.extension';
import changePasswordButtonComponent from './change-password-button/change-password-button.component';
import logoutButtonComponent from './logout/logout.extension';
import changePasswordComponent from './change-password/change-password'

const moduleName = '@openmrs/esm-login-app';

const options = {
  featureName: 'login',
  moduleName,
};

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
  registerBreadcrumbs([
    {
      path: `${window.spaBase}/change-password`,
      title: "Change user password",
      parent: `${window.spaBase}/home`,
    },
  ]);
}

export const root = getSyncLifecycle(rootComponent, options);
export const locationPicker = getSyncLifecycle(locationPickerComponent, options);
export const logoutButton = getSyncLifecycle(logoutButtonComponent, options);
export const changePassword = getSyncLifecycle(changePasswordComponent, options);
export const changeLocationLink = getSyncLifecycle(changeLocationLinkComponent, options);
export const changePasswordButton = getSyncLifecycle(changePasswordButtonComponent, options);
