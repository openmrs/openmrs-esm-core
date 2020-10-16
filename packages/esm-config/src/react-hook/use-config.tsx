import React from "react";
import { ModuleNameContext } from "@openmrs/esm-context";
import * as Config from "../module-config/module-config";

let config = {};
let error;

/**
 * Use this React Hook to obtain your module's configuration.
 */
export function useConfig() {
  const moduleName = React.useContext(ModuleNameContext);
  if (!moduleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }
  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }
  if (!config[moduleName]) {
    // React will prevent the client component from rendering until the promise resolves
    throw Config.getConfig(moduleName)
      .then((res) => {
        config[moduleName] = res;
      })
      .catch((err) => {
        error = err;
      });
  } else {
    return config[moduleName];
  }
}

export function clearConfig() {
  config = {};
}
