import { openmrsFetch } from "@openmrs/esm-api";
import * as semver from "semver";
import { difference, isEmpty } from "lodash-es";

const installedBackendModules: Array<Record<string, string>> = [];
const modulesWithMissingBackendModules: MissingBackendModules[] = [];
const modulesWithWrongBackendModulesVersion: MissingBackendModules[] = [];

let memorizedUnresolvedsBackendDeps: UnresolvedBackendDependencies;

async function initInstalledBackendModules() {
    try {
        const response = await fetchInstalledBackendModules();
        installedBackendModules.push(...response.data.results);
    } catch (err) {
        setTimeout(() => {
            throw err;
        });
    }
}

export async function checkModules(): Promise<UnresolvedBackendDependencies> {
    if (memorizedUnresolvedsBackendDeps) return memorizedUnresolvedsBackendDeps;

    const modules = (window.installedModules ?? [])
        .filter((module) => module[1].backendDependencies)
        .map((module) => ({
            backendDependencies: module[1].backendDependencies,
            moduleName: module[0],
        }));

    await initInstalledBackendModules();
    modules.forEach((module) => checkIfModulesAreInstalled(module));

    memorizedUnresolvedsBackendDeps = {
        modulesWithMissingBackendModules,
        modulesWithWrongBackendModulesVersion,
    };

    return memorizedUnresolvedsBackendDeps;
}

function checkIfModulesAreInstalled(module: Module) {
    const missingBackendModule = getMissingBackendModules(module.backendDependencies);
    const installedAndRequiredModules = getInstalledAndRequiredBackendModules(module.backendDependencies);
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

function getMissingBackendModules(requiredBackendModules: Record<string, string>) {
    const requiredBackendModulesUuids = Object.keys(requiredBackendModules);
    const installedBackendModuleUuids = installedBackendModules.map((res) => res.uuid);
    const missingModules = difference(requiredBackendModulesUuids, installedBackendModuleUuids);
    return missingModules.map((key) => {
        return { uuid: key, version: requiredBackendModules[key] };
    });
}

function getInstalledAndRequiredBackendModules(requiredBackendModules: Record<string, string>) {
    const requiredModules = Object.keys(requiredBackendModules).map((key) => {
        return { uuid: key, version: requiredBackendModules[key] };
    });
    return requiredModules.filter((requiredModule) => {
        return installedBackendModules.find((installedModule) => {
            return requiredModule.uuid === installedModule.uuid;
        });
    });
}

function getMisMatchedBackendModules(installedAndRequiredBackendModules: BackendModule[]) {
    let misMatchedBackendModules: BackendModule[] = [];
    for (let uuid in installedAndRequiredBackendModules) {
        const installedVersion = installedBackendModules[uuid].version;
        const requiredVersion = installedAndRequiredBackendModules[uuid].version;
        const moduleName = installedAndRequiredBackendModules[uuid].uuid;

        if (!isVersionInstalled(requiredVersion, installedVersion)) {
            misMatchedBackendModules.push({
                uuid: moduleName,
                requiredVersion: requiredVersion,
                version: installedVersion,
            });
        }
    }
    return misMatchedBackendModules;
}

function isVersionInstalled(requiredVersion: string, installedVersion: string) {
    return semver.eq(
        // @ts-ignore
        semver.coerce(requiredVersion),
        semver.coerce(installedVersion)
    );
}

export interface UnresolvedBackendDependencies {
    modulesWithMissingBackendModules: MissingBackendModules[];
    modulesWithWrongBackendModulesVersion: MissingBackendModules[];
}

export interface BackendModule {
    uuid: string;
    version: string;
    requiredVersion?: string;
}

export interface MissingBackendModules {
    moduleName: string;
    backendModules: BackendModule[];
}

export interface Module {
    moduleName: string;
    backendDependencies: Record<string, string>;
}
