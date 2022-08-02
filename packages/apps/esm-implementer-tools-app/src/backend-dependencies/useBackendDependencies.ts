import { useEffect, useState } from "react";
import {
  checkModules,
  ResolvedDependenciesModule,
} from "./openmrs-backend-dependencies";

export function useBackendDependencies() {
  const [
    modulesWithMissingBackendModules,
    setModulesWithMissingBackendModules,
  ] = useState<Array<ResolvedDependenciesModule>>([]);

  useEffect(() => {
    // loading missing modules
    checkModules().then(setModulesWithMissingBackendModules);
  }, []);

  return modulesWithMissingBackendModules;
}
