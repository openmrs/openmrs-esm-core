import React from "react";

let areDevDefaultsOn = false;

export const getDevtoolsConfig = jest
  .fn()
  .mockResolvedValue({ "esm-something": { foo: 1 } });
export const getAreDevDefaultsOn = jest
  .fn()
  .mockImplementation(() => areDevDefaultsOn);
export const setAreDevDefaultsOn = jest.fn().mockImplementation((val) => {
  areDevDefaultsOn = val;
});

export const ModuleNameContext = React.createContext("fake-module-config");
