import React from 'react';

export const useLayoutType = jest.fn(() => 'tablet');

export function openmrsFetch() {
  return new Promise(() => {});
}

export function getCurrentUser() {
  return Promise.resolve({ authenticated: false });
}

export function createErrorHandler() {
  return true;
}

export function refetchCurrentUser() {
  return Promise.resolve({});
}

export const ComponentContext = React.createContext(null);

export const openmrsComponentDecorator = jest.fn().mockImplementation(() => (component) => component);

export const Extension = jest.fn().mockImplementation((props: any) => {
  return <slot />;
});

export const ExtensionSlot = ({ children }) => <>{children}</>;
