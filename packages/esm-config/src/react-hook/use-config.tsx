import { useContext, useEffect } from "react";
import { ModuleNameContext } from "@openmrs/esm-context";
import * as Config from "../module-config/module-config";
import {
  configCache,
  configCacheNotifier,
  useForceUpdate,
} from "./config-cache";

let error;

/**
 * Use this React Hook to obtain your module's configuration.
 */
export function useConfig() {
  const moduleName = useContext(ModuleNameContext);
  const forceUpdate = useForceUpdate();

  if (!moduleName) {
    throw Error(
      "ModuleNameContext has not been provided. This should come from openmrs-react-root-decorator"
    );
  }

  function getConfigAndSetCache(moduleName: string) {
    return Config.getConfig(moduleName)
      .then((res) => {
        configCache[moduleName] = res;
        forceUpdate();
      })
      .catch((err) => {
        error = err;
      });
  }

  useEffect(() => {
    const sub = configCacheNotifier.subscribe(() => {
      getConfigAndSetCache(moduleName);
    });
    return () => sub.unsubscribe();
  }, [moduleName]);

  if (error) {
    // Suspense will just keep calling useConfig if the thrown promise rejects.
    // So we check ahead of time and avoid creating a new promise.
    throw error;
  }
  if (!configCache[moduleName]) {
    // React will prevent the client component from rendering until the promise resolves
    throw getConfigAndSetCache(moduleName);
  } else {
    return configCache[moduleName];
  }
}
