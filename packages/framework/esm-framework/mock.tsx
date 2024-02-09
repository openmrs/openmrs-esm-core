import React from 'react';
import type {} from '@openmrs/esm-globals';
import { createStore, type StoreApi } from 'zustand';
import { NEVER, of } from 'rxjs';
import { type SessionStore } from '@openmrs/esm-api';
import * as utils from '@openmrs/esm-utils';

window.i18next = { ...window.i18next, language: 'en' };

// Needed for all mocks using stores
const availableStores: Record<string, StoreEntity> = {};
const initialStates: Record<string, any> = {};

/* esm-globals */

export function setupPaths(config: any) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || 'production';
  window.spaVersion = process.env.BUILD_VERSION;
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

/* esm-api */
export const setSessionLocation = jest.fn(() => Promise.resolve());
export const openmrsFetch = jest.fn((url?: string) => new Promise(() => {}));
export const openmrsObservableFetch = jest.fn(() => of({ data: { entry: [] } }));
export function getCurrentUser() {
  return of({ authenticated: false });
}
export const mockSessionStore = createGlobalStore<SessionStore>('mock-session-store', {
  loaded: false,
  session: null,
});
export const getSessionStore = jest.fn(() => mockSessionStore);
export const setCurrentVisit = jest.fn();
export const newWorkspaceItem = jest.fn();
export const fhirBaseUrl = '/ws/fhir2/R4';
export const attachmentUrl = '/ws/rest/v1/attachment';
export const getAttachmentByUuid = jest.fn();
export const getAttachments = jest.fn();
export const createAttachment = jest.fn();
export const deleteAttachmentPermanently = jest.fn();
export const clearCurrentUser = jest.fn();
export const refetchCurrentUser = jest.fn();
export const setUserLanguage = jest.fn();

/* esm-state */
interface StoreEntity {
  value: StoreApi<any>;
  active: boolean;
}

export type MockedStore<T> = StoreApi<T> & {
  resetMock: () => void;
};

export const mockStores = availableStores;

export function createGlobalStore<T>(name: string, initialState: T): StoreApi<T> {
  // We ignore whether there's already a store with this name so that tests
  // don't have to worry about clearing old stores before re-creating them.
  const store = createStore<T>()(() => initialState);
  initialStates[name] = initialState;

  availableStores[name] = {
    value: store,
    active: true,
  };

  return instrumentedStore(name, store);
}

export function getGlobalStore<T>(name: string, fallbackState?: T): StoreApi<T> {
  const available = availableStores[name];

  if (!available) {
    const store = createStore<T>()(() => fallbackState ?? ({} as unknown as T));
    initialStates[name] = fallbackState;
    availableStores[name] = {
      value: store,
      active: false,
    };
    return instrumentedStore(name, store);
  }

  return instrumentedStore(name, available.value);
}

function instrumentedStore<T>(name: string, store: StoreApi<T>) {
  return {
    getState: jest.spyOn(store, 'getState'),
    setState: jest.spyOn(store, 'setState'),
    subscribe: jest.spyOn(store, 'subscribe'),
    resetMock: () => store.setState(initialStates[name]),
  } as any as MockedStore<T>;
}

/* esm-config */
export { validators, validator } from '@openmrs/esm-config';

export const configInternalStore = createGlobalStore('config-internal', {});

export const implementerToolsConfigStore = createGlobalStore('implementer-tools-config', {});

export const temporaryConfigStore = createGlobalStore('temporary-config', {});

export enum Type {
  Array = 'Array',
  Boolean = 'Boolean',
  ConceptUuid = 'ConceptUuid',
  Number = 'Number',
  Object = 'Object',
  String = 'String',
  UUID = 'UUID',
}

let configSchema = {};

export const getConfig = jest
  .fn()
  .mockImplementation(() => Promise.resolve(utils.getDefaultsFromConfigSchema(configSchema)));

export const useConfig = jest.fn().mockImplementation(() => utils.getDefaultsFromConfigSchema(configSchema));

export function defineConfigSchema(moduleName, schema) {
  configSchema = schema;
}

export function defineExtensionConfigSchema(extensionName, schema) {
  configSchema = schema;
}

export const clearConfigErrors = jest.fn();

/* esm-dynamic-loading */
export const importDynamic = jest.fn();

/* esm-error-handling */
export const createErrorHandler = () => jest.fn().mockReturnValue(NEVER);

export const reportError = jest.fn().mockImplementation((error) => {
  throw error;
});

/* esm-extensions */

export const attach = jest.fn();
export const detach = jest.fn();
export const detachAll = jest.fn();

export const switchTo = jest.fn();

export const ExtensionSlot = jest.fn().mockImplementation(({ children }) => <>{children}</>);

export const Extension = jest.fn().mockImplementation((props: any) => <slot />);

export const getExtensionStore = () => getGlobalStore('extensions', { slots: {} });

export const getExtensionInternalStore = () =>
  getGlobalStore('extensions-internal', {
    slots: {},
    extensions: {},
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

/* esm-react-utils */
export { ConfigurableLink, isDesktop, useStore, useStoreWithActions, createUseStore } from '@openmrs/esm-react-utils';

export const ComponentContext = React.createContext(null);

export const openmrsComponentDecorator = jest.fn().mockImplementation(() => (component) => component);

export const useAttachments = jest.fn(() => ({
  isLoading: true,
  data: [],
  error: null,
  mutate: jest.fn(),
  isValidating: true,
}));

export const useCurrentPatient = jest.fn(() => []);

export const usePatient = jest.fn(() => ({
  isLoading: true,
  patient: null,
  patientUuid: null,
  error: null,
}));

export const useSession = jest.fn(() => ({
  authenticated: false,
  sessionId: '',
}));

export const useLayoutType = jest.fn(() => 'desktop');

export const useAssignedExtensions = jest.fn(() => []);

export const useExtensionSlotMeta = jest.fn(() => ({}));

export const useConnectedExtensions = jest.fn(() => []);

export const UserHasAccess = jest.fn().mockImplementation((props: any) => {
  return props.children;
});

export const useExtensionInternalStore = createGlobalStore('extensionInternal', getExtensionInternalStore());

export const useExtensionStore = getExtensionStore();

export const useFeatureFlag = jest.fn().mockReturnValue(true);

export const usePagination = jest.fn().mockImplementation(() => ({
  currentPage: 1,
  goTo: () => {},
  results: [],
}));

export const useVisit = jest.fn().mockReturnValue({
  error: null,
  mutate: jest.fn(),
  isValidating: true,
  currentVisit: null,
  activeVisit: null,
  currentVisitIsRetrospective: false,
});

export const useVisitTypes = jest.fn(() => []);

export const useAbortController = jest.fn().mockReturnValue(() => {
  let aborted = false;
  return jest.fn(
    () =>
      ({
        abort: () => {
          aborted = true;
        },
        signal: {
          aborted,
        },
      }) as AbortController,
  );
});

export function useOpenmrsSWR(key: string | Array<any>) {
  return { data: openmrsFetch(key.toString()) };
}

export const useDebounce = jest.fn().mockImplementation((value) => value);

export const useOnClickOutside = jest.fn();

/* esm-styleguide */
export const showNotification = jest.fn();
export const showActionableNotification = jest.fn();
export const showToast = jest.fn();
export const showSnackbar = jest.fn();
export const showModal = jest.fn();

export const LeftNavMenu = jest.fn(() => <div>Left Nav Menu</div>);
export const setLeftNav = jest.fn();
export const unsetLeftNav = jest.fn();

export const OpenmrsDatePicker = jest.fn(() => <div>OpenMRS DatePicker</div>);

export const LocationPicker = jest.fn(({ onChange, selectedLocationUuid }) => {
  const locations = [
    {
      uuid: 'uuid_1',
      name: 'location_1',
    },
    {
      uuid: 'uuid_2',
      name: 'location_2',
    },
  ];
  return (
    <div>
      {locations.map((location) => (
        <label key={location.uuid}>
          <input
            type="radio"
            name="location"
            value={location.uuid}
            checked={location.uuid === selectedLocationUuid}
            onChange={() => onChange(location.uuid)}
          />
          {location.name}
        </label>
      ))}
    </div>
  );
});

/* esm-utils */
export { getDefaultsFromConfigSchema, parseDate, formatDate, formatDatetime, formatTime } from '@openmrs/esm-utils';

export const age = jest.fn((arg) => utils.age(arg));

export function isVersionSatisfied() {
  return true;
}

export const translateFrom = jest.fn((m, key, fallback) => fallback ?? key);
