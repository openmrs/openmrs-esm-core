import { createRequire } from 'node:module';
import { glob } from 'glob';
import { URL } from 'url';
import { basename, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { exec } from 'child_process';
import { logFail, logInfo, logWarn } from './logger';
import { startDevServer } from './devserver';
import { getMainBundle, getAppRoutes } from './dependencies';
import { getAvailablePort } from './port';
import type { PackageJson } from './types';

async function readImportmap(path: string, backend?: string, spaPath?: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return fetchRemoteImportmap(path);
  } else if (path === 'importmap.json') {
    if (backend && spaPath) {
      try {
        return await fetchRemoteImportmap(`${backend}${spaPath}importmap.json`);
      } catch (e) {
        logWarn(
          `Could not read importmap from ${backend}${spaPath}importmap.json. Falling back to import map from https://dev3.openmrs.org/openmrs/spa/importmap.json: ${e}`,
        );
      }
    }

    return fetchRemoteImportmap('https://dev3.openmrs.org/openmrs/spa/importmap.json');
  }

  return '{"imports":{}}';
}

async function readRoutes(path: string, backend?: string, spaPath?: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return fetchRemoteRoutes(path);
  } else if (path === 'routes.registry.json') {
    if (backend && spaPath) {
      try {
        return await fetchRemoteRoutes(`${backend}${spaPath}routes.registry.json`);
      } catch (e) {
        logWarn(
          `Could not read routes registry from ${backend}${spaPath}routes.registry.json. Falling back to routes registry from https://dev3.openmrs.org/openmrs/spa/routes.registry.json: ${e}`,
        );
      }
    }

    return fetchRemoteRoutes('https://dev3.openmrs.org/openmrs/spa/routes.registry.json');
  }

  return '{}';
}

async function fetchRemoteImportmap(fetchUrl: string) {
  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch import map from ${fetchUrl}: ${res.status} ${res.statusText}`);
  }

  const m = await res.json();

  if (typeof m === 'object' && m !== null && 'imports' in m && typeof m.imports === 'object' && m.imports !== null) {
    const imports = m.imports;
    Object.keys(imports).forEach((key) => {
      const url = imports[key];

      if (typeof url === 'string') {
        imports[key] = new URL(url, fetchUrl).href;
      }
    });
  }

  return JSON.stringify(m);
}

async function fetchRemoteRoutes(fetchUrl: string) {
  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch routes from ${fetchUrl}: ${res.status} ${res.statusText}`);
  }

  const m = await res.json();
  return JSON.stringify(m);
}

export interface ImportmapDeclaration {
  type: 'inline' | 'url';
  value: string;
}

export interface RoutesDeclaration {
  type: 'inline' | 'url';
  value: string;
}

export interface ImportmapAndRoutes {
  importMap: ImportmapDeclaration;
  routes: RoutesDeclaration;
}

export interface ImportmapAndRoutesWithWatches extends ImportmapAndRoutes {
  importMap: ImportmapDeclaration;
  routes: RoutesDeclaration;
  watchedRoutesPaths: Record<string, string>;
}

export function checkImportmapJson(value: string) {
  try {
    const content = JSON.parse(value);
    return typeof content === 'object' && typeof content.imports === 'object';
  } catch {
    return false;
  }
}

export function checkRoutesJson(value: string) {
  try {
    const content = JSON.parse(value);
    return (
      typeof content === 'object' &&
      content !== null &&
      !Array.isArray(content) &&
      Object.entries(content).every(
        ([key, value]) =>
          typeof key === 'string' && typeof value === 'object' && value !== null && !Array.isArray(value),
      )
    );
  } catch {
    return false;
  }
}

async function matchAny(baseDir: string, patterns: Array<string>) {
  const results = await Promise.all(patterns.map((pattern) => glob(pattern, { cwd: baseDir })));
  return results.flat();
}

const defaultConfigPath = resolve(import.meta.dirname, '..', '..', 'default-rspack-config.cjs');

function runProjectDevServer(
  configPath: string,
  port: number,
  project: PackageJson,
  sourceDirectory: string,
  importMap: Record<string, string>,
  routes: Record<string, unknown>,
  useRspack: boolean = false,
) {
  const bundle = getMainBundle(project);
  const host = `http://localhost:${port}`;

  const { ready } = startDevServer(configPath, port, sourceDirectory, useRspack);
  importMap[project.name] = `${host}/${bundle.name}`;
  routes[project.name] = getAppRoutes(sourceDirectory, project);

  return ready;
}

export async function runProject(
  basePort: number,
  sourceDirectoryPatterns: Array<string>,
  useRspack?: boolean,
): Promise<{
  importMap: Record<string, string>;
  routes: Record<string, unknown>;
  watchedRoutesPaths: Record<string, string>;
}> {
  const baseDir = process.cwd();
  const sourceDirectories = await matchAny(baseDir, sourceDirectoryPatterns);
  const importMap = {};
  const routes = {};
  const watchedRoutesPaths = {};
  const devServerReadyPromises: Array<Promise<void>> = [];

  // Track the starting port, which is one more than the last used port
  let nextPortToCheck = basePort + 1;

  logInfo('Loading dynamic import map and routes ...');

  for (const sourceDir of sourceDirectories) {
    const sourceDirectory = resolve(baseDir, sourceDir);
    const projectFile = resolve(sourceDirectory, 'package.json');
    const routesFile = resolve(sourceDirectory, 'src', 'routes.json');

    const configPath = resolve(sourceDirectory, 'webpack.config.js');
    const rspackConfigPath = resolve(sourceDirectory, 'rspack.config.js');
    const hasConfig = typeof useRspack !== 'undefined' ? !useRspack : existsSync(configPath);
    const hasRspackConfig = typeof useRspack !== 'undefined' ? useRspack : existsSync(rspackConfigPath);

    logInfo(`Looking in directory "${sourceDirectory}" ...`);

    if (!existsSync(projectFile)) {
      logFail(`No "package.json" found in directory "${sourceDirectory}". Skipping ...`);
      continue;
    }

    const require = createRequire(import.meta.url);
    const project: PackageJson = require(projectFile);
    const startup = project['openmrs:develop'];

    if (existsSync(routesFile)) {
      watchedRoutesPaths[project.name] = routesFile;
    }

    if (typeof startup === 'object') {
      // detected specialized startup command
      const cp = exec(startup.command, {
        cwd: sourceDirectory,
      });
      cp.stdout?.pipe(process.stdout);
      cp.stderr?.pipe(process.stderr);
      // connect to either startup.url or a computed value based on startup.host
      const bundle = getMainBundle(project);
      importMap[project.name] = startup.url || `${startup.host}/${bundle.name}`;
    } else if (!hasConfig && !hasRspackConfig) {
      // try to locate and run via default webpack
      logWarn(`No "webpack.config.js" found in directory "${sourceDirectory}". Trying to use default config ...`);

      // Find next available port
      const port = await getAvailablePort(nextPortToCheck);
      nextPortToCheck = port + 1;

      devServerReadyPromises.push(
        runProjectDevServer(defaultConfigPath, port, project, sourceDirectory, importMap, routes),
      );
    } else {
      // Find next available port
      const port = await getAvailablePort(nextPortToCheck);
      nextPortToCheck = port + 1;

      if (hasConfig) {
        // run via specialized webpack.config.js
        devServerReadyPromises.push(runProjectDevServer(configPath, port, project, sourceDirectory, importMap, routes));
      } else {
        devServerReadyPromises.push(
          runProjectDevServer(rspackConfigPath, port, project, sourceDirectory, importMap, routes, true),
        );
      }
    }
  }

  await Promise.all(devServerReadyPromises);

  logInfo(`Assembled dynamic import map and routes for packages (${Object.keys(importMap).join(', ')}).`);

  return { importMap, routes, watchedRoutesPaths };
}

/**
 * @param importAndRoutes An ImportmapAndRoutes object that holds the current import map and routes registries
 * @param additionalImportsAndRoutes An object containing any import map entries, routes, and watched route files to add to the setup
 * @param backend The URL for the backend
 * @param spaPath The spaPath for this instance
 * @returns The import map declaration with the new imports added in. If
 *   there are new imports to add, and if the original import map declaration
 *   had type "url", it is downloaded and resolved to one of type "inline".
 */
export async function mergeImportmapAndRoutes(
  importAndRoutes: ImportmapAndRoutes,
  additionalImportsAndRoutes:
    | {
        importMap: Record<string, string>;
        routes: Record<string, unknown>;
        watchedRoutesPaths: Record<string, string>;
      }
    | false,
  backend?: string,
  spaPath?: string,
): Promise<ImportmapAndRoutesWithWatches> {
  const { importMap: importDecl, routes: routesDecl } = importAndRoutes;
  const {
    importMap: additionalImports,
    routes: additionalRoutes,
    watchedRoutesPaths = {},
  } = additionalImportsAndRoutes || {};

  if (additionalImports && Object.keys(additionalImports).length > 0) {
    if (importDecl.type === 'url') {
      importDecl.type = 'inline';
      importDecl.value = await readImportmap(importDecl.value, backend, spaPath);
    }

    const map = JSON.parse(importDecl.value);

    importDecl.value = JSON.stringify({
      imports: {
        ...map.imports,
        ...additionalImports,
      },
    });
  }

  if (additionalRoutes && Object.keys(additionalRoutes).length > 0) {
    if (routesDecl.type === 'url') {
      routesDecl.type = 'inline';
      routesDecl.value = await readRoutes(routesDecl.value, backend, spaPath);
    }

    const routes = JSON.parse(routesDecl.value);

    routesDecl.value = JSON.stringify({
      ...routes,
      ...additionalRoutes,
    });
  }

  return { importMap: importDecl, routes: routesDecl, watchedRoutesPaths };
}

export async function getImportmapAndRoutes(
  importMapPath: string,
  routesPath: string,
  basePort?: number,
): Promise<ImportmapAndRoutes> {
  return Promise.all([getImportMap(importMapPath, basePort), getRoutes(routesPath)]).then(([importMap, routes]) => {
    return { importMap, routes };
  });
}

export async function getImportMap(importMapPath: string, basePort?: number): Promise<ImportmapDeclaration> {
  if (importMapPath === '@' && basePort) {
    logWarn('Using the "@" import map is deprecated. Switch to use the "--run-project" flag.');

    const imports = await runProject(basePort, ['.']);

    return {
      type: 'inline',
      value: JSON.stringify({
        imports,
      }),
    };
  } else if (!/^https?:\/\//.test(importMapPath)) {
    const path = resolve(process.cwd(), importMapPath);

    if (existsSync(path)) {
      const content = readFileSync(path, 'utf8');
      const valid = checkImportmapJson(content);

      if (!valid) {
        logWarn(`The import map provided in "${importMapPath}" does not seem right. Skipping.`);
      }

      return {
        type: 'inline',
        value: valid ? content : '',
      };
    } else if (checkImportmapJson(importMapPath)) {
      return {
        type: 'inline',
        value: importMapPath,
      };
    }
  }

  return {
    type: 'url',
    value: importMapPath,
  };
}

export async function getRoutes(routesPath: string): Promise<RoutesDeclaration> {
  if (!/^https?:\/\//.test(routesPath)) {
    const path = resolve(process.cwd(), routesPath);

    if (existsSync(path)) {
      const content = readFileSync(path, 'utf8');
      const valid = checkRoutesJson(content);

      if (!valid) {
        logWarn(`The routes provided provided in "${routesPath}" does not seem right. Skipping.`);
      }

      return {
        type: 'inline',
        value: valid ? content : '',
      };
    } else if (checkRoutesJson(routesPath)) {
      return {
        type: 'inline',
        value: routesPath,
      };
    }
  }

  return {
    type: 'url',
    value: routesPath,
  };
}

/**
 * @param importmapAndRoutes An ImportmapAndRoutes object that holds the import map and routes registry
 * @param backend The URL for the backend
 * @param spaPath The spaPath for this instance
 * @returns The same import map declaration but with all imports changed to the appropriate path
 */
export function proxyImportmapAndRoutes(
  importmapAndRoutes: ImportmapAndRoutesWithWatches,
  backend: string,
  spaPath: string,
) {
  const { importMap: importMapDecl, routes: routesDecl, watchedRoutesPaths } = importmapAndRoutes;
  if (importMapDecl.type != 'inline') {
    throw new Error(
      'proxyImportmapAndRoutes called on non-inline import map. This is a programming error. Value: ' +
        importMapDecl.value,
    );
  }

  if (routesDecl.type != 'inline') {
    throw new Error(
      'proxyImportmapAndRoutes called on non-inline routes. This is a programming error. Value: ' + routesDecl.value,
    );
  }

  const backendUrl = new URL(backend);
  const importmap = JSON.parse(importMapDecl.value);
  const spaPathRegEx = new RegExp('^' + spaPath.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'));

  Object.keys(importmap.imports).forEach((key) => {
    const url = new URL(importmap.imports[key], backendUrl);
    if (url.protocol === backendUrl.protocol && url.host === backendUrl.host) {
      importmap.imports[key] = `./${url.pathname.replace(spaPathRegEx, '')}${url.search}${url.hash}`;
    }
  });
  importMapDecl.value = JSON.stringify(importmap);

  return { importmap: importMapDecl, routes: routesDecl, watchedRoutesPaths };
}
