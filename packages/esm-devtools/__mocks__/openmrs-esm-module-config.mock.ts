import React from "react";

export const getDevtoolsConfig = jest.fn().mockResolvedValue({});

export const ModuleNameContext = React.createContext("fake-module-config");
