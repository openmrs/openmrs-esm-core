import { useEffect, useState } from 'react';
import type { ResolvedDependenciesModule } from './openmrs-backend-dependencies';
import { checkModules } from './openmrs-backend-dependencies';

export function useBackendDependencies() {
  const [modulesWithMissingBackendModules, setModulesWithMissingBackendModules] = useState<
    Array<ResolvedDependenciesModule>
  >([]);

  useEffect(() => {
    // loading missing modules
    checkModules().then(setModulesWithMissingBackendModules);
  }, []);

  return modulesWithMissingBackendModules;
}
