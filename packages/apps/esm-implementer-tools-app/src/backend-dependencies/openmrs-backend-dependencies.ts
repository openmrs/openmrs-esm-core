import { isVersionSatisfied, openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import difference from 'lodash-es/difference';

export type ResolvedBackendModuleType = 'missing' | 'version-mismatch' | 'okay';

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
  optionalBackendDependencies?: {
    [k: string]:
      | string
      | {
          version: string;
          feature?: string;
        };
  };
}

interface VersionCheckModule extends Omit<Module, 'optionalBackendDependencies'> {
  optionalBackendDependencies?: Record<string, string>;
}

interface BackendModule {
  uuid: string;
  version: string;
}

let cachedFrontendModules: Array<ResolvedDependenciesModule>;

const MAX_PAGES = 50;

async function initInstalledBackendModules(): Promise<Array<BackendModule>> {
  try {
    const modules = await fetchInstalledBackendModules();
    return modules;
  } catch (err) {
    console.error(err);
  }

  return [];
}

function checkIfModulesAreInstalled(
  module: VersionCheckModule,
  installedBackendModules: Array<BackendModule>,
): ResolvedDependenciesModule {
  const dependencies: Array<ResolvedBackendModule> = [];

  const missingBackendModule = getMissingBackendModules(module.backendDependencies, installedBackendModules);

  const installedAndRequiredModules = getInstalledAndRequiredBackendModules(
    module.backendDependencies,
    module.optionalBackendDependencies,
    installedBackendModules,
  );

  dependencies.push(
    ...missingBackendModule.map((m) => ({
      name: m.uuid,
      requiredVersion: m.version,
      type: 'missing' as ResolvedBackendModuleType,
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
    }),
  );

  return {
    name: module.moduleName,
    dependencies,
  };
}

async function fetchInstalledBackendModules(): Promise<Array<BackendModule>> {
  const collected: Array<BackendModule> = [];
  let nextUrl: string | null = `${restBaseUrl}/module?v=custom:(uuid,version)`;
  let safetyCounter = 0;

  const resolveNext = (url?: string | null) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return url;
    return `${restBaseUrl}/${url.replace(/^\/?/, '')}`;
  };

  while (nextUrl && safetyCounter < MAX_PAGES) {
    try {
      const { data } = await openmrsFetch(nextUrl, { method: 'GET' });
      const rawResults: Array<BackendModule> = Array.isArray(data?.results) ? data.results : [];

      const pageResults: Array<BackendModule> = rawResults.map((r) => ({
        uuid: r.uuid,
        version: r.version,
      }));

      collected.push(...pageResults);

      const links: Array<{ rel?: string; uri?: string; href?: string }> = Array.isArray(data?.links) ? data.links : [];
      const nextLink = links.find((l) => (l.rel || '').toLowerCase() === 'next');

      nextUrl = resolveNext(nextLink?.uri ?? null);
      safetyCounter += 1;
    } catch (e) {
      console.error(`Failed to fetch installed backend modules page ${safetyCounter + 1} (URL: ${nextUrl})`, e);
      break;
    }
  }

  if (nextUrl && safetyCounter >= MAX_PAGES) {
    console.warn(
      `Reached maximum page limit (${MAX_PAGES}) while fetching backend modules. There may be more data available at: ${nextUrl}`,
    );
  }

  return collected;
}

function getMissingBackendModules(
  requiredBackendModules: Record<string, string> | undefined,
  installedBackendModules: Array<BackendModule>,
): Array<BackendModule> {
  if (!requiredBackendModules) {
    return [];
  }

  const requiredBackendModulesUuids = Object.keys(requiredBackendModules);
  const installedBackendModuleUuids = installedBackendModules.map((res) => res.uuid);

  const missingModules = difference(requiredBackendModulesUuids, installedBackendModuleUuids);

  return missingModules.map((key) => ({
    uuid: key,
    version: requiredBackendModules[key],
  }));
}

function getInstalledAndRequiredBackendModules(
  requiredBackendModules: Record<string, string> | undefined,
  optionalBackendModules: Record<string, string> | undefined,
  installedBackendModules: Array<BackendModule>,
): Array<BackendModule> {
  if (!requiredBackendModules) {
    return [];
  }

  const declaredBackendModules = { ...optionalBackendModules, ...requiredBackendModules };

  const requiredModules = Object.keys(declaredBackendModules).map((key) => ({
    uuid: key,
    version: declaredBackendModules[key],
  }));

  return requiredModules.filter((requiredModule) => {
    return installedBackendModules.find((installedModule) => {
      return requiredModule.uuid === installedModule.uuid;
    });
  });
}

function getInstalledVersion(
  installedAndRequiredBackendModule: BackendModule,
  installedBackendModules: Array<BackendModule>,
) {
  const moduleName = installedAndRequiredBackendModule.uuid;
  return installedBackendModules.find((mod) => mod.uuid == moduleName)?.version ?? '';
}

function getResolvedModuleType(requiredVersion: string, installedVersion: string): ResolvedBackendModuleType {
  if (!isVersionSatisfied(requiredVersion, installedVersion)) {
    return 'version-mismatch';
  }

  return 'okay';
}

export async function checkModules(): Promise<Array<ResolvedDependenciesModule>> {
  if (!cachedFrontendModules) {
    const modules = (window.installedModules ?? [])
      .filter((module) => Boolean(module[1]?.backendDependencies || module[1]?.optionalBackendDependencies))
      .map((module) => ({
        backendDependencies: module[1].backendDependencies,
        optionalBackendDependencies: Object.fromEntries(
          Object.entries(module[1].optionalBackendDependencies ?? {}).map(([key, value]) =>
            typeof value === 'string' || typeof value === 'undefined' ? [key, value] : [key, value.version],
          ),
        ),
        moduleName: module[0],
      }));

    const installedBackendModules = await initInstalledBackendModules();
    cachedFrontendModules = modules.map((m) => checkIfModulesAreInstalled(m, installedBackendModules));
  }

  return cachedFrontendModules;
}

export function hasInvalidDependencies(frontendModules: Array<ResolvedDependenciesModule>) {
  return frontendModules.some((m) => m.dependencies.some((n) => n.type !== 'okay'));
}
