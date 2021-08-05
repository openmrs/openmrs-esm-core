import { useEffect, useState } from "react";
import { checkModules, FrontendModule } from "./openmrs-backend-dependencies";

export function useBackendDependencies() {
  const [
    modulesWithMissingBackendModules,
    setModulesWithMissingBackendModules,
  ] = useState<Array<FrontendModule>>([]);

  useEffect(() => {
    // loading missing modules
    checkModules().then(setModulesWithMissingBackendModules);
  }, []);

  return modulesWithMissingBackendModules;
}
