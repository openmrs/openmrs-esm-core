import * as semver from "semver";
import { openmrsFetch } from "@openmrs/esm-api";
import difference from "lodash-es/difference";
import isEmpty from "lodash-es/isEmpty";

interface FrontendModuleSpecifier {
  moduleName: string;
}

interface BackendModuleSpecifier {
  uuid: string;
}

interface BackendModule extends BackendModuleSpecifier {
  version: string;
}

interface MismatchingModules extends BackendModuleSpecifier {
  installedVersion?: string;
  requiredVersion: string;
}

type ModuleDefinition = FrontendModuleSpecifier & System.Module;

interface MissingBackendModules extends FrontendModuleSpecifier {
  backendModules: Array<BackendModule>;
}

interface WrongBackendModules extends FrontendModuleSpecifier {
  backendModules: Array<MismatchingModules>;
}

const installedBackendModules: Array<BackendModule> = [];
const modulesWithMissingBackendModules: Array<MissingBackendModules> = [];
const modulesWithWrongBackendModulesVersion: Array<WrongBackendModules> = [];

const originalOnload = System.constructor.prototype.onload;

System.constructor.prototype.onload = function (
  err: Error | undefined,
  id: string
) {
  const moduleName = id.substring(id.lastIndexOf("/") + 1, id.indexOf(".js"));

  if (!err) {
    System.import(id)
      .then((response) => {
        const module = Object.assign({ moduleName }, response);
        if (module.backendDependencies) {
          checkBackendDeps(module);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });
  }
  return originalOnload.apply(this, arguments);
};

function checkBackendDeps(module: ModuleDefinition) {
  if (isEmpty(installedBackendModules)) {
    fetchInstalledBackendModules()
      .then(({ data }) => {
        installedBackendModules.push(...data.results);
        checkIfModulesAreInstalled(module);
      })
      .catch((err) => {
        setTimeout(() => {
          throw err;
        });
      });
  } else {
    checkIfModulesAreInstalled(module);
  }
}

function checkIfModulesAreInstalled(module: ModuleDefinition) {
  const missingBackendModule = getMissingBackendModules(
    module.backendDependencies
  );
  const installedAndRequiredModules = getInstalledAndRequiredBackendModules(
    module.backendDependencies
  );

  if (missingBackendModule.length > 0) {
    modulesWithMissingBackendModules.push({
      moduleName: module.moduleName,
      backendModules: missingBackendModule,
    });
  }

  if (installedAndRequiredModules.length > 0) {
    modulesWithWrongBackendModulesVersion.push({
      moduleName: module.moduleName,
      backendModules: getMisMatchedBackendModules(installedAndRequiredModules),
    });
  }
}

function fetchInstalledBackendModules() {
  return openmrsFetch(`/ws/rest/v1/module?v=custom:(uuid,version)`, {
    method: "GET",
  });
}

function getMissingBackendModules(
  requiredBackendModules: Record<string, string>
) {
  const requiredBackendModulesUuids = Object.keys(requiredBackendModules);
  const installedBackendModuleUuids = installedBackendModules.map(
    (res) => res.uuid
  );
  const missingModules = difference(
    requiredBackendModulesUuids,
    installedBackendModuleUuids
  );
  return missingModules.map((key) => {
    return { uuid: key, version: requiredBackendModules[key] };
  });
}

function getInstalledAndRequiredBackendModules(
  requiredBackendModules: Record<string, string>
) {
  const requiredModules = Object.keys(requiredBackendModules).map((key) => {
    return { uuid: key, version: requiredBackendModules[key] };
  });

  const installedAndRequiredBackendModules = requiredModules.filter(
    (requiredModule) => {
      return installedBackendModules.find((installedModule) => {
        return requiredModule.uuid === installedModule.uuid;
      });
    }
  );

  return installedAndRequiredBackendModules;
}

function getMisMatchedBackendModules(
  installedAndRequiredBackendModules: Array<BackendModule>
) {
  const misMatchedBackendModules: Array<MismatchingModules> = [];

  for (const backendModule of installedAndRequiredBackendModules) {
    const requiredVersion = backendModule.version;
    const moduleName = backendModule.uuid;
    const installedVersion = installedBackendModules
      .filter((m) => m.uuid === moduleName)
      .shift()?.version;

    if (!isVersionInstalled(requiredVersion, installedVersion)) {
      misMatchedBackendModules.push({
        uuid: moduleName,
        requiredVersion: requiredVersion,
        installedVersion: installedVersion,
      });
    }
  }

  return misMatchedBackendModules;
}

function isVersionInstalled(
  requiredVersion: string,
  installedVersion?: string
) {
  return semver.eq(
    semver.coerce(requiredVersion) || "",
    semver.coerce(installedVersion) || ""
  );
}

export {
  modulesWithMissingBackendModules,
  modulesWithWrongBackendModulesVersion,
};
