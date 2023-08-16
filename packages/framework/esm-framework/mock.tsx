import React from "react";
import type {} from "@openmrs/esm-globals";
import { createStore, StoreApi } from "zustand";
import { never, of } from "rxjs";
import { interpolateUrl } from "@openmrs/esm-config";
import { SessionStore } from "@openmrs/esm-api";
export {
  parseDate,
  formatDate,
  formatDatetime,
  formatTime,
  age,
} from "@openmrs/esm-utils";
export {
  interpolateString,
  interpolateUrl,
  validators,
  validator,
} from "@openmrs/esm-config";

window.i18next = { ...window.i18next, language: "en" };

// Needed for all mocks using stores
const availableStores: Record<string, StoreEntity> = {};
const initialStates: Record<string, any> = {};

/* esm-globals */

export function setupPaths(config: any) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || "production";
  window.spaVersion = process.env.BUILD_VERSION;
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

/* esm-utils */
export function isVersionSatisfied() {
  return true;
}

export function useConnectivity() {
  return true;
}

/* esm-api */
export const setSessionLocation = jest.fn(() => Promise.resolve());

export const openmrsFetch = jest.fn(() => new Promise(() => {}));

export const openmrsObservableFetch = jest.fn(() =>
  of({ data: { entry: [] } })
);

export function getCurrentUser() {
  return of({ authenticated: false });
}

export const mockSessionStore = createGlobalStore<SessionStore>(
  "mock-session-store",
  {
    loaded: false,
    session: null,
  }
);

export const getSessionStore = jest.fn(() => mockSessionStore);

export const setCurrentVisit = jest.fn();

export const newWorkspaceItem = jest.fn();

export const fhirBaseUrl = "/ws/fhir2/R4";

/* esm-state */
interface StoreEntity {
  value: StoreApi<any>;
  active: boolean;
}

export type MockedStore<T> = StoreApi<T> & {
  resetMock: () => void;
};

export const mockStores = availableStores;

export function createGlobalStore<T>(
  name: string,
  initialState: T
): StoreApi<T> {
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

export function getGlobalStore<T>(
  name: string,
  fallbackState?: T
): StoreApi<T> {
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
    getState: jest.spyOn(store, "getState"),
    setState: jest.spyOn(store, "setState"),
    subscribe: jest.spyOn(store, "subscribe"),
    resetMock: () => store.setState(initialStates[name]),
  } as any as MockedStore<T>;
}

/* esm-config */
export const configInternalStore = createGlobalStore("config-internal", {});

export const implementerToolsConfigStore = createGlobalStore(
  "implementer-tools-config",
  {}
);

export const temporaryConfigStore = createGlobalStore("temporary-config", {});

export enum Type {
  Array = "Array",
  Boolean = "Boolean",
  ConceptUuid = "ConceptUuid",
  Number = "Number",
  Object = "Object",
  String = "String",
  UUID = "UUID",
}

let configSchema = {};
function getDefaults(schema) {
  let tmp = {};
  for (let k of Object.keys(schema)) {
    if (schema[k].hasOwnProperty("_default")) {
      tmp[k] = schema[k]._default;
    } else if (k.startsWith("_")) {
      continue;
    } else if (isOrdinaryObject(schema[k])) {
      tmp[k] = getDefaults(schema[k]);
    } else {
      tmp[k] = schema[k];
    }
  }
  return tmp;
}
function isOrdinaryObject(x) {
  return !!x && x.constructor === Object;
}

export const getConfig = jest.fn().mockReturnValue(getDefaults(configSchema));

export const useConfig = jest.fn().mockReturnValue(getDefaults(configSchema));

export function defineConfigSchema(moduleName, schema) {
  configSchema = schema;
}

export function defineExtensionConfigSchema(extensionName, schema) {
  configSchema = schema;
}

export const navigate = jest.fn();

export const ConfigurableLink = jest
  .fn()
  .mockImplementation((config: { to: string; children: React.ReactNode }) => (
    <a href={interpolateUrl(config.to)}>{config.children}</a>
  ));

/* esm-dynamic-loading */
export const importDynamic = jest.fn();

/* esm-error-handling */
export const createErrorHandler = () => jest.fn().mockReturnValue(never());

export const reportError = jest.fn().mockImplementation((error) => {
  throw error;
});

/* esm-feature-flags */
export const registerFeatureFlags = jest.fn();
export const getFeatureFlag = jest.fn().mockReturnValue(true);
export const subscribeToFeatureFlag = jest.fn((name: string, callback) =>
  callback(true)
);

/* esm-extensions */

export const attach = jest.fn();
export const detach = jest.fn();
export const detachAll = jest.fn();

export const switchTo = jest.fn();

export const ExtensionSlot = jest
  .fn()
  .mockImplementation(({ children }) => <>{children}</>);

export const Extension = jest.fn().mockImplementation((props: any) => <slot />);

export const getExtensionStore = () =>
  getGlobalStore("extensions", { slots: {} });

export const getExtensionInternalStore = () =>
  getGlobalStore("extensions-internal", {
    slots: {},
    extensions: {},
  });

/* esm-react-utils */

export const ComponentContext = React.createContext(null);

export const openmrsComponentDecorator = jest
  .fn()
  .mockImplementation(() => (component) => component);

export const useCurrentPatient = jest.fn(() => []);

export const usePatient = jest.fn(() => ({
  isLoading: true,
  patient: null,
  patientUuid: null,
  error: null,
}));

export const useSession = jest.fn(() => ({
  authenticated: false,
  sessionId: "",
}));

export const useLayoutType = jest.fn(() => "desktop");

export const useExtensionSlotMeta = jest.fn(() => ({}));

export const useConnectedExtensions = jest.fn(() => []);

export const UserHasAccess = jest.fn().mockImplementation((props: any) => {
  return props.children;
});

export const useExtensionInternalStore = createGlobalStore(
  "extensionInternal",
  getExtensionInternalStore()
);

export const useExtensionStore = getExtensionStore();

export const useFeatureFlag = jest.fn().mockReturnValue(true);

export {
  isDesktop,
  useStore,
  useStoreWithActions,
  createUseStore,
} from "@openmrs/esm-react-utils";

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

/* esm-styleguide */

export const showNotification = jest.fn();
export const showActionableNotification = jest.fn();
export const showToast = jest.fn();
export const showModal = jest.fn();

export const LeftNavMenu = jest.fn();
export const setLeftNav = jest.fn();
export const unsetLeftNav = jest.fn();
