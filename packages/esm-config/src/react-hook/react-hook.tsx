import React from "react";
import * as Config from "../module-config/module-config";

export const ModuleNameContext = React.createContext<string | null>(null);

let config = {};

export function useConfig() {
  const moduleName = React.useContext(ModuleNameContext);
  if (!moduleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }
  if (!config[moduleName]) {
    // React will prevent the client component from rendering until the promise resolves
    throw Config.getConfig(moduleName).then(res => {
      config[moduleName] = res;
    });
  } else {
    return config[moduleName];
  }
}

export function clearConfig() {
  config = {};
}
