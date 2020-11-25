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
