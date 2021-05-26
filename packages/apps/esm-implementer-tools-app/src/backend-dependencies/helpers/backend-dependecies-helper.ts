import { MissingBackendModules } from "../openmrs-backend-dependencies";

export interface ModuleDiagnosticsProps {
  setHasAlert(value: boolean): void;
  modulesWithMissingBackendModules: Array<MissingBackendModules>;
  modulesWithWrongBackendModulesVersion: Array<MissingBackendModules>;
}

export interface FrontendModule {
  name: string;
  unresolvedDeps: Array<UnresolvedBackendDependency>;
}

export type DeficiencyType = "missing" | "version-mismatch";

export interface UnresolvedBackendDependency {
  name: string;
  requiredVersion?: string;
  installedVersion?: string;
  type: DeficiencyType;
}

export function parseUnresolvedDeps(
  modulesWithWrongBackendModulesVersion: Array<MissingBackendModules>,
  modulesWithMissingBackendModules: Array<MissingBackendModules>
): Array<FrontendModule> {
  let similarEsms: Array<MissingBackendModules> = [];
  const unresolvedDeps1 = modulesWithWrongBackendModulesVersion.map((m) => {
    const similarEsm = modulesWithMissingBackendModules.find(
      (x) => x.moduleName === m.moduleName
    );

    let leavesForSimilarEsm: Array<UnresolvedBackendDependency> = [];

    if (similarEsm) {
      leavesForSimilarEsm = similarEsm.backendModules.map(
        (m) =>
          ({
            name: m.uuid,
            requiredVersion: m.version,
            type: "missing",
          } as UnresolvedBackendDependency)
      );
      similarEsms.push(similarEsm);
    }
    const leaves = m.backendModules.map(
      (m) =>
        ({
          name: m.uuid,
          installedVersion: m.version,
          requiredVersion: m.requiredVersion,
          type: "version-mismatch",
        } as UnresolvedBackendDependency)
    );
    return {
      name: m.moduleName,
      unresolvedDeps: [...leaves, ...leavesForSimilarEsm],
    };
  });
  const unresolvedDeps2 = modulesWithMissingBackendModules
    .filter((m) => !similarEsms.includes(m))
    .map((m) => {
      const leaves = m.backendModules.map((m) => ({
        name: m.uuid,
        requiredVersion: m.version,
        type: "missing",
      }));
      return { name: m.moduleName, unresolvedDeps: leaves } as FrontendModule;
    });
  return [...unresolvedDeps1, ...unresolvedDeps2];
}
