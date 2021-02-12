import React from "react";

export const ComponentContext = React.createContext(null);

export const openmrsComponentDecorator = jest
  .fn()
  .mockImplementation(() => (component) => component);

export function UserHasAccess(props: any) {
  return props.children;
}
