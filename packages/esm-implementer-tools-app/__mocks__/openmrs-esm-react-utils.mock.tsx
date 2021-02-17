import { Store } from "unistore";
import React from "react";
import { extensionStore } from "@openmrs/esm-extensions";

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
