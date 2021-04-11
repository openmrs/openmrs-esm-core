import { useEffect, useState } from "react";
import {
  checkModules,
  MissingBackendModules,
} from "./openmrs-backend-dependencies";

export function useBackendDependencies() {
  const [
    modulesWithMissingBackendModules,
    setModulesWithMissingBackendModules,
  ] = useState<Array<MissingBackendModules>>([]);
  const [
    modulesWithWrongBackendModulesVersion,
    setModulesWithWrongBackendModulesVersion,
  ] = useState<Array<MissingBackendModules>>([]);

  useEffect(() => {
    // loading missing modules
    checkModules().then(
      ({
        modulesWithMissingBackendModules,
        modulesWithWrongBackendModulesVersion,
      }) => {
        setModulesWithMissingBackendModules(modulesWithMissingBackendModules);
        setModulesWithWrongBackendModulesVersion(
          modulesWithWrongBackendModulesVersion
        );
      }
    );
  }, []);

  return [
    modulesWithMissingBackendModules,
    modulesWithWrongBackendModulesVersion,
  ];
}
