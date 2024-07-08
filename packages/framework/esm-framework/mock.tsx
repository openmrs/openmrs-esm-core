import React from 'react';
import { NEVER } from 'rxjs';
import type {} from '@openmrs/esm-globals';
import * as utils from '@openmrs/esm-utils';
import { OpenmrsDatePicker as realOpenmrsDatePicker } from './src';

window.i18next = { ...window.i18next, language: 'en' };

export * from '@openmrs/esm-api/mock';
export * from '@openmrs/esm-config/mock';
export * from '@openmrs/esm-context';
export * from '@openmrs/esm-extensions/mock';
export * from '@openmrs/esm-react-utils/mock';
export * from '@openmrs/esm-state/mock';
export * from '@openmrs/esm-styleguide/mock';
export * from '@openmrs/esm-translations/mock';

/* esm-globals */

export function setupPaths(config: any) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || 'production';
  window.spaVersion = process.env.BUILD_VERSION ?? 'local';
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

/* esm-dynamic-loading */
export const importDynamic = jest.fn();

/* esm-error-handling */
export const createErrorHandler = () => jest.fn().mockReturnValue(NEVER);

export const reportError = jest.fn().mockImplementation((error) => {
  throw error;
});

/* esm-feature-flags */
export const registerFeatureFlags = jest.fn();
export const getFeatureFlag = jest.fn().mockReturnValue(true);
export const subscribeToFeatureFlag = jest.fn((name: string, callback) => callback(true));

/* esm-navigation */
export { interpolateUrl, interpolateString } from '@openmrs/esm-navigation';
export const navigate = jest.fn();
export const getHistory = jest.fn(() => ['https://o3.openmrs.org/home']);
export const clearHistory = jest.fn();
export const goBackInHistory = jest.fn();

/* esm-offline */
export const useConnectivity = jest.fn().mockReturnValue(true);
export const subscribeConnectivity = jest.fn();

/* esm-styleguide */
export const showNotification = jest.fn();
export const showActionableNotification = jest.fn();
export const showToast = jest.fn();
export const showSnackbar = jest.fn();
export const showModal = jest.fn();

export const LeftNavMenu = jest.fn(() => <div>Left Nav Menu</div>);
export const setLeftNav = jest.fn();
export const unsetLeftNav = jest.fn();
export const ResponsiveWrapper = jest.fn(({ children }) => <>{children}</>);
export const OpenmrsDatePicker = jest.fn(realOpenmrsDatePicker);
export const ErrorState = jest.fn(() => <div>Error State</div>);

export const CustomOverflowMenu = jest.fn(({ menuTitle, children }) => (
  <div>
    <button>{menuTitle}</button>
    {children}
  </div>
));
export const PatientBannerActionsMenu = jest.fn(() => <div>Patient Banner Actions Menu</div>);
export const PatientBannerContactDetails = jest.fn(() => <div>Patient Banner Contact Details</div>);
export const PatientBannerPatientInfo = jest.fn(() => <div>Patient Banner Patient Info</div>);
export const PatientBannerToggleContactDetailsButton = jest.fn(() => (
  <div>Patient Banner Toggle Contact Details Button</div>
));
export const PatientPhoto = jest.fn(() => <div>Patient Photo</div>);
export const usePatientPhoto = jest.fn(() => ({
  isLoading: true,
  data: null,
  error: null,
}));

export const ActionMenuButton = jest.fn(({ handler }) => <button onClick={handler}>Action Menu Button</button>);
export const ActionMenu = jest.fn(() => <div>Action Menu</div>);
export const WorkspaceContainer = jest.fn(() => <div>Workspace Container</div>);
export const closeWorkspace = jest.fn();
export const launchWorkspace = jest.fn();
export const navigateAndLaunchWorkspace = jest.fn();
export const useWorkspaces = jest.fn();

/* esm-utils */
export {
  getDefaultsFromConfigSchema,
  parseDate,
  formatDate,
  formatDatetime,
  formatTime,
  getPatientName,
  formatPatientName,
  selectPreferredName,
} from '@openmrs/esm-utils';

export const age = jest.fn((arg) => utils.age(arg));

export function isVersionSatisfied() {
  return true;
}
