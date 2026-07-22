import { defineConfigSchema, getAsyncLifecycle, getSyncLifecycle } from '@openmrs/esm-framework';
import { configSchema } from './config-schema';
import changeLocationLinkComponent from './change-location-link/change-location-link.extension';
import changePasswordLinkComponent from './change-password/change-password-link.extension';
import locationPickerComponent from './location-picker/location-picker-view.component';
import logoutButtonComponent from './logout/logout.extension';
import rootComponent from './root.component';
import twoFactorAuthLinkComponent from './two-factor-auth/two-factor-auth-link.extension';
import TwoFactorAuth from './two-factor-auth/two-factor-auth.component';

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
export const locationPicker = getSyncLifecycle(locationPickerComponent, options);
export const logoutButton = getSyncLifecycle(logoutButtonComponent, options);
export const changeLocationLink = getSyncLifecycle(changeLocationLinkComponent, options);
export const changePasswordLink = getSyncLifecycle(changePasswordLinkComponent, options);
export const changePasswordModal = getAsyncLifecycle(() => import('./change-password/change-password.modal'), options);
export const twoFactorAuthLink = getSyncLifecycle(twoFactorAuthLinkComponent, options);
export const twoFactorAuth = getSyncLifecycle(TwoFactorAuth, options);
export const totpEnrollmentModal = getAsyncLifecycle(() => import('./two-factor-auth/totp-enrollment.modal'), options);
