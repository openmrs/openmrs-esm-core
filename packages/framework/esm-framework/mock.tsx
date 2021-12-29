import React from "react";
import type {} from "@openmrs/esm-globals";
import createStore, { Store } from "unistore";
import { never, of } from "rxjs";
import dayjs from "dayjs";

interface StoreEntity {
  value: Store<any>;
  active: boolean;
}

export type MockedStore<T> = Store<T> & { resetMock: () => void };

const initialStates: Record<string, any> = {};

const availableStores: Record<string, StoreEntity> = {};

export function isVersionSatisfied() {
  return true;
}

export const setSessionLocation = jest.fn(() => Promise.resolve());

export const mockStores = availableStores;

export function createGlobalStore<TState>(
  name: string,
  initialState: TState
): Store<TState> {
  const available = availableStores[name];

  if (available) {
    if (available.active) {
      console.error(
        "Cannot override an existing store. Make sure that stores are only created once."
      );
    } else {
      available.value.setState(initialState, true);
    }

    available.active = true;
    return available.value;
  } else {
    const store = createStore(initialState);
    initialStates[name] = initialState;

    availableStores[name] = {
      value: store,
      active: true,
    };

    return instrumentedStore(name, store);
  }
}

export function getGlobalStore<TState = any>(
  name: string,
  fallbackState?: TState
): Store<TState> {
  const available = availableStores[name];

  if (!available) {
    const store = createStore(fallbackState);
    initialStates[name] = fallbackState;
    availableStores[name] = {
      value: store,
      active: false,
    };
    return instrumentedStore(name, store);
  }

  return instrumentedStore(name, available.value);
}

function instrumentedStore<T>(name: string, store: Store<T>) {
  return {
    action: jest.spyOn(store, "action"),
    getState: jest.spyOn(store, "getState"),
    setState: jest.spyOn(store, "setState"),
    subscribe: jest.spyOn(store, "subscribe"),
    unsubscribe: jest.spyOn(store, "unsubscribe"),
    resetMock: () => store.setState(initialStates[name]),
  } as any as MockedStore<T>;
}

export const configInternalStore = createGlobalStore("config-internal", {
  devDefaultsAreOn: false,
});

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

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn(),
  isUuid: jest.fn(),
  isObject: jest.fn(),
};

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

export const createErrorHandler = () => jest.fn().mockReturnValue(never());

export const reportError = jest.fn().mockImplementation((error) => {
  throw error;
});

export const switchTo = jest.fn();

export const UserHasAccessReact = (props: any) => props.children;

export const openmrsFetch = jest.fn(() => new Promise(() => {}));

export const openmrsObservableFetch = jest.fn(() =>
  of({ data: { entry: [] } })
);

export const setIsUIEditorEnabled = (boolean): void => {};

export const useCurrentPatient = jest.fn(() => [null, null, null, null]);

export const useSessionUser = jest.fn(() => null);

export const useLayoutType = jest.fn(() => "desktop");

export const useExtensionSlot = jest.fn(() => ({
  extensionSlotModuleName: "",
  attachedExtensionSlotName: "",
  extensionIdsToRender: [],
}));

export const useExtension = jest.fn(() => [React.createRef(), undefined]);

export const getCurrentPatient = jest.fn(() =>
  jest.fn().mockReturnValue(never())
);

export function getCurrentUser() {
  return of({ authenticated: false });
}

export const navigate = jest.fn();

export const interpolateString = jest.fn();

export const getCurrentPatientUuid = jest.fn();

export const newWorkspaceItem = jest.fn();

export const fhirBaseUrl = "/ws/fhir2/R4";

export const ExtensionSlot = ({ children }) => <>{children}</>;

export const Extension = jest.fn().mockImplementation((props: any) => <slot />);

export const ConfigurableLink = jest
  .fn()
  .mockImplementation((config: { to: string; children: React.ReactNode }) => (
    <a href={interpolateString(config.to)}>{config.children}</a>
  ));

let state = { slots: {}, extensions: {} };

export const extensionStore = {
  getState: () => state,
  setState: (val) => {
    state = { ...state, ...val };
  },
  subscribe: (updateFcn) => {
    updateFcn(state);
    return () => {};
  },
  unsubscribe: () => {},
};

export const ComponentContext = React.createContext(null);

export const openmrsComponentDecorator = jest
  .fn()
  .mockImplementation(() => (component) => component);

export const UserHasAccess = jest.fn().mockImplementation((props: any) => {
  return props.children;
});

export const createUseStore = (store: Store<any>) => (actions) => {
  const state = store.getState();
  return { ...state, ...actions };
};

export const useExtensionStore = (actions) => {
  const state = extensionStore.getState();
  return { ...state, ...actions };
};

export const useStore = (store: Store<any>, actions) => {
  const state = store.getState();
  return { ...state, ...actions };
};

export const showNotification = jest.fn();
export const showToast = jest.fn();

export function setupPaths(config: any) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || "production";
  window.spaVersion = process.env.BUILD_VERSION;
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

export const attach = jest.fn();
export const detach = jest.fn();
export const detachAll = jest.fn();

export const usePagination = jest.fn().mockImplementation(() => ({
  currentPage: 1,
  goTo: () => {},
  results: [],
}));

export const useVisitTypes = jest.fn(() => []);

export const formatDate = jest.fn((date: Date, mode) => {
  if (!mode || mode == "standard") {
    return dayjs(date).format("DD-MMM-YYYY");
  }
  if (mode == "wide") {
    return dayjs(date).format("DD - MMM - YYYY");
  }
  if (mode == "no day") {
    return dayjs(date).format("MMM YYYY");
  }
  if (mode == "no year") {
    return dayjs(date).format("DD MMM");
  }
  console.warn("Unknown formatDate mode: ", mode);
  return dayjs(date).format("DD-MMM-YYYY");
});

export const formatTime = jest.fn((date: Date) => {
  return dayjs(date).format("HH:mm");
});

export const formatDatetime = jest.fn((date: Date, mode) => {
  return formatDate(date, mode) + " " + formatTime(date);
});
