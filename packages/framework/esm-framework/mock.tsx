import React from 'react';
import { vi } from 'vitest';
import { NEVER } from 'rxjs';
import type {} from '@openmrs/esm-globals';
import * as utils from '@openmrs/esm-utils';
import dayjs from 'dayjs';

window.i18next = { ...window.i18next, language: 'en' };

export * from '@openmrs/esm-api/mock';
export * from '@openmrs/esm-emr-api/mock';
export * from '@openmrs/esm-config/mock';
export * from '@openmrs/esm-context';
export * from '@openmrs/esm-expression-evaluator/src/public';
export * from '@openmrs/esm-extensions/mock';
export * from '@openmrs/esm-react-utils/mock';
export * from '@openmrs/esm-state/mock';
export * from '@openmrs/esm-styleguide/mock';
export * from '@openmrs/esm-translations/mock';

export { parseDate, formatDate, formatDatetime, formatTime } from '@openmrs/esm-utils';

/* esm-globals */

export function setupPaths(config: any) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || 'production';
  window.spaVersion = process.env.BUILD_VERSION ?? 'local';
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

/* esm-dynamic-loading */
export const importDynamic = vi.fn();

/* esm-error-handling */
export const createErrorHandler = () => vi.fn().mockReturnValue(NEVER);

export const reportError = vi.fn().mockImplementation((error) => {
  throw error;
});

/* esm-feature-flags */
export const registerFeatureFlags = vi.fn();
export const getFeatureFlag = vi.fn().mockReturnValue(true);
export const subscribeToFeatureFlag = vi.fn((name: string, callback) => callback(true));

/* esm-navigation */
export { interpolateUrl, interpolateString } from '@openmrs/esm-navigation';
export const navigate = vi.fn();
export const getHistory = vi.fn(() => ['https://o3.openmrs.org/home']);
export const clearHistory = vi.fn();
export const goBackInHistory = vi.fn();

/* esm-offline */
export const useConnectivity = vi.fn().mockReturnValue(true);
export const subscribeConnectivity = vi.fn();

/* esm-styleguide */
export const showNotification = vi.fn();
export const showActionableNotification = vi.fn();
export const showToast = vi.fn();
export const showSnackbar = vi.fn();
export const showModal = vi.fn();

export const LeftNavMenu = vi.fn(() => <div>Left Nav Menu</div>);
export const setLeftNav = vi.fn();
export const unsetLeftNav = vi.fn();
export const ResponsiveWrapper = vi.fn(({ children }) => <>{children}</>);
export const ErrorState = vi.fn(() => <div>Error State</div>);

export const CustomOverflowMenu = vi.fn(({ menuTitle, children }) => (
  <div>
    <button>{menuTitle}</button>
    {children}
  </div>
));
export const PatientBannerActionsMenu = vi.fn(() => <div>Patient Banner Actions Menu</div>);
export const PatientBannerContactDetails = vi.fn(() => <div>Patient Banner Contact Details</div>);
export const PatientBannerPatientInfo = vi.fn(() => <div>Patient Banner Patient Info</div>);
export const PatientBannerPatientIdentifiers = vi.fn(() => <div>Patient Banner Patient Identifier</div>);
export const PatientBannerToggleContactDetailsButton = vi.fn(() => (
  <div>Patient Banner Toggle Contact Details Button</div>
));
export const PatientPhoto = vi.fn(() => <div>Patient Photo</div>);
export const usePatientPhoto = vi.fn(() => ({
  isLoading: true,
  data: null,
  error: null,
}));

export const ActionMenuButton = vi.fn(({ handler }) => <button onClick={handler}>Action Menu Button</button>);
export const ActionMenu = vi.fn(() => <div>Action Menu</div>);
export const WorkspaceContainer = vi.fn(() => <div>Workspace Container</div>);
export const closeWorkspace = vi.fn();
export const launchWorkspace = vi.fn();
export const launchWorkspaceGroup = vi.fn();
export const navigateAndLaunchWorkspace = vi.fn();
export const useWorkspaces = vi.fn();

export const OpenmrsDatePicker = vi.fn(({ id, labelText, value, onChange, isInvalid, invalidText }) => (
  <>
    <label htmlFor={id}>{labelText}</label>
    <input
      id={id}
      type="text"
      value={value ? dayjs(value).format('DD/MM/YYYY') : ''}
      onChange={(evt) => onChange?.(dayjs(evt.target.value).toDate())}
    />
    {isInvalid && <span>{invalidText}</span>}
  </>
));

/* esm-utils */
export {
  getDefaultsFromConfigSchema,
  getPatientName,
  formatPatientName,
  selectPreferredName,
} from '@openmrs/esm-utils';

export const age = vi.fn((arg) => utils.age(arg));

export function isVersionSatisfied() {
  return true;
}
