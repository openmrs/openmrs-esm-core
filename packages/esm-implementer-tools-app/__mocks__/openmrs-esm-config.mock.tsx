import React from "react";

let areDevDefaultsOn = false;

export const getImplementerToolsConfig = jest.fn().mockResolvedValue({});

export const getAreDevDefaultsOn = jest
  .fn()
  .mockImplementation(() => areDevDefaultsOn);

export const setAreDevDefaultsOn = jest.fn().mockImplementation((val) => {
  areDevDefaultsOn = val;
});

export const getTemporaryConfig = jest.fn().mockReturnValue({});

export const setTemporaryConfigValue = jest.fn();

export const ModuleNameContext = React.createContext("fake-module-config");

export enum Type {
  Array = "Array",
  Boolean = "Boolean",
  ConceptUuid = "ConceptUuid",
  Number = "Number",
  Object = "Object",
  String = "String",
  UUID = "UUID",
}
