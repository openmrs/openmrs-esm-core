import { merge } from "lodash-es";
import { Store } from "unistore";
import React from "react";

export const ExtensionContext = React.createContext({
  extensionSlotName: "",
  extensionId: "",
  extensionModuleName: "",
});

export const ModuleNameContext = React.createContext(null);

export const openmrsRootDecorator = jest
  .fn()
  .mockImplementation(() => (component) => component);

export const UserHasAccess = jest.fn().mockImplementation((props: any) => {
  return props.children;
});

export const createUseStore = (store: Store<any>) => (reducer, actions) => {
  const state = store.getState();
  return merge(
    actions,
    typeof reducer === "string" ? { [reducer]: state[reducer] } : {},
    ...(Array.isArray(reducer) ? reducer.map((r) => ({ [r]: state[r] })) : [{}])
  );
};
