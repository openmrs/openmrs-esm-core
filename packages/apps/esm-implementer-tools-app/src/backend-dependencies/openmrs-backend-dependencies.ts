import { isVersionSatisfied, openmrsFetch } from "@openmrs/esm-framework";
import difference from "lodash-es/difference";

export type ResolvedBackendModuleType = "missing" | "version-mismatch" | "okay";

export interface ResolvedBackendModule {
  name: string;
  requiredVersion: string;
  installedVersion?: string;
  type: ResolvedBackendModuleType;
}

export interface ResolvedDependenciesModule {
  name: string;
  dependencies: Array<ResolvedBackendModule>;
}

interface Module {
  moduleName: string;
  backendDependencies?: Record<string, string>;
}

interface BackendModule {
  uuid: string;
  version: string;
}

let cachedFrontendModules: Array<ResolvedDependenciesModule>;

async function initInstalledBackendModules(): Promise<Array<BackendModule>> {
  try {
    const response = await fetchInstalledBackendModules();
    return response.data.results;
  } catch (err) {
    console.error(err);
  }

  return [];
}

function checkIfModulesAreInstalled(
  module: Module,
  installedBackendModules: Array<BackendModule>
): ResolvedDependenciesModule {
  const dependencies: Array<ResolvedBackendModule> = [];

  const missingBackendModule = getMissingBackendModules(
    module.backendDependencies,
    installedBackendModules
  );

  const installedAndRequiredModules = getInstalledAndRequiredBackendModules(
    module.backendDependencies,
    installedBackendModules
  );

  dependencies.push(
    ...missingBackendModule.map((m) => ({
      name: m.uuid,
      requiredVersion: m.version,
      type: "missing" as ResolvedBackendModuleType,
    })),
    ...installedAndRequiredModules.map((m) => {
      const requiredVersion = m.version;
      const installedVersion = getInstalledVersion(m, installedBackendModules);
      return {
        name: m.uuid,
        requiredVersion,
        installedVersion,
        type: getResolvedModuleType(requiredVersion, installedVersion),
      };
    })
  );

  return {
    name: module.moduleName,
    dependencies,
  };
}

function fetchInstalledBackendModules() {
  return openmrsFetch(`/ws/rest/v1/module?v=custom:(uuid,version)`, {
    method: "GET",
  });
}

function getMissingBackendModules(
  requiredBackendModules: Record<string, string> | undefined,
  installedBackendModules: Array<BackendModule>
): Array<BackendModule> {
  if (!requiredBackendModules) {
    return [];
  }

  const requiredBackendModulesUuids = Object.keys(requiredBackendModules);
  const installedBackendModuleUuids = installedBackendModules.map(
    (res) => res.uuid
  );

  const missingModules = difference(
    requiredBackendModulesUuids,
    installedBackendModuleUuids
  );

  return missingModules.map((key) => ({
    uuid: key,
    version: requiredBackendModules[key],
  }));
}

function getInstalledAndRequiredBackendModules(
  requiredBackendModules: Record<string, string> | undefined,
  installedBackendModules: Array<BackendModule>
): Array<BackendModule> {
  if (!requiredBackendModules) {
    return [];
  }

  const requiredModules = Object.keys(requiredBackendModules).map((key) => ({
    uuid: key,
    version: requiredBackendModules[key],
  }));

  return requiredModules.filter((requiredModule) => {
    return installedBackendModules.find((installedModule) => {
      return requiredModule.uuid === installedModule.uuid;
    });
  });
}

function getInstalledVersion(
  installedAndRequiredBackendModule: BackendModule,
  installedBackendModules: Array<BackendModule>
) {
  const moduleName = installedAndRequiredBackendModule.uuid;
  return (
    installedBackendModules.find((mod) => mod.uuid == moduleName)?.version ?? ""
  );
}

function getResolvedModuleType(
  requiredVersion: string,
  installedVersion: string
): ResolvedBackendModuleType {
  if (!isVersionSatisfied(requiredVersion, installedVersion)) {
    return "version-mismatch";
  }

  return "okay";
}

export async function checkModules(): Promise<
  Array<ResolvedDependenciesModule>
> {
  if (!cachedFrontendModules) {
    const modules = (window.installedModules ?? [])
      .filter((module) => Boolean(module[1]?.backendDependencies))
      .map((module) => ({
        backendDependencies: module[1].backendDependencies,
        moduleName: module[0],
      }));

    const installedBackendModules = await initInstalledBackendModules();
    cachedFrontendModules = modules.map((m) =>
      checkIfModulesAreInstalled(m, installedBackendModules)
    );
  }

  return cachedFrontendModules;
}

export function hasInvalidDependencies(
  frontendModules: Array<ResolvedDependenciesModule>
) {
  return frontendModules.some((m) =>
    m.dependencies.some((n) => n.type !== "okay")
  );
}
