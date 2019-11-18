import React from "react";
import * as Config from "../module-config/module-config";

export const ModuleNameContext = React.createContext(null);

// As written, this will not work to provide config to more than one module.
// `config` will be shared across client modules, resulting in all modules
// receiving the configuration for the module that happens to call this first.
//
// When using useState to manage the config, the browser tab goes into infinite
// recursion via setConfig().
//
let config;
export function useConfig() {
  const moduleName = React.useContext(ModuleNameContext);
  if (!moduleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }
  if (!config) {
    // React will prevent the client component from rendering until the promise resolves
    throw Config.getConfig(moduleName).then(res => {
      config = res;
    });
  } else {
    return config;
  }
}
