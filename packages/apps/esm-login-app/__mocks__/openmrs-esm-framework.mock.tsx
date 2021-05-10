import { of } from "rxjs";
import React from "react";

export function openmrsFetch() {
  return new Promise(() => {});
}

export function getCurrentUser() {
  return of({ authenticated: false });
}

export function defineConfigSchema() {}

export const validators = {
  isBoolean: jest.fn(),
  isString: jest.fn(),
};

export const navigate = jest.fn();

export const Type = {
  Array: "Array",
  Boolean: "Boolean",
  ConceptUuid: "ConceptUuid",
  Number: "Number",
  Object: "Object",
  String: "String",
  UUID: "UUID",
};

export function createErrorHandler() {
  return function errorHandler(err) {
    console.log(`Received error ${err}`);
  };
}

export const openmrsComponentDecorator = jest
  .fn()
  .mockImplementation(() => (f) => f);

export const config = {
  chooseLocation: {
    enabled: true,
    numberToShow: 3,
  },
  logo: {
    src: null,
    alt: "Logo",
  },
  links: {
    loginSuccess: "${openmrsSpaBase}/home",
  },
};

export function useConfig() {
  return config;
}

export const ComponentContext = React.createContext({
  moduleName: "fake-module-config",
});
