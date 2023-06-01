import { URL } from "url";
import { basename, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { exec } from "child_process";
import { logFail, logInfo, logWarn } from "./logger";
import { startWebpack } from "./webpack";
import { getMainBundle, getAppRoutes } from "./dependencies";
// TODO Replace with fallback to routes.registry.json on dev3
import coreRoutes from "@openmrs/esm-app-shell/src/assets/routes.registry.json";
import axios from "axios";

import glob = require("glob");

async function readImportmap(path: string, backend?: string, spaPath?: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return fetchRemoteImportmap(path);
  } else if (path === "importmap.json") {
    if (backend && spaPath) {
      try {
        return await fetchRemoteImportmap(`${backend}${spaPath}importmap.json`);
      } catch {}
    }

    return fetchRemoteImportmap(
      "https://dev3.openmrs.org/openmrs/spa/importmap.json"
    );
  }

  return '{"imports":{}}';
}

async function fetchRemoteImportmap(fetchUrl: string) {
  return await axios
    .get(fetchUrl)
    .then((res) => res.data)
    .then((m) => (typeof m === "string" ? JSON.parse(m) : m))
    .then((m) => {
      if (typeof m === "object" && "imports" in m) {
        Object.keys(m.imports).forEach((key) => {
          const url = m.imports[key];

          if (typeof url === "string") {
            m.imports[key] = new URL(url, fetchUrl).href;
          }
        });
      }
      return m;
    })
    .then((m) => JSON.stringify(m));
}

export interface ImportmapDeclaration {
  type: "inline" | "url";
  value: string;
}

export interface ImportmapAndRoutes {
  importMap: ImportmapDeclaration;
  routes: Record<string, unknown>;
}

export function checkImportmapJson(value: string) {
  try {
    const content = JSON.parse(value);
    return typeof content === "object" && typeof content.imports === "object";
  } catch {
    return false;
  }
}

async function matchAny(baseDir: string, patterns: Array<string>) {
  const matches: Array<string> = [];
  await Promise.all(
    patterns.map(
      (pattern) =>
        new Promise<void>((resolve, reject) => {
          glob(
            pattern,
            {
              cwd: baseDir,
            },
            (err, files) => {
              if (err) {
                reject(err);
              } else {
                matches.push(...files);
                resolve();
              }
            }
          );
        })
    )
  );
  return matches;
}

const defaultConfigPath = resolve(
  __dirname,
  "..",
  "..",
  "default-webpack-config.js"
);

function runProjectWebpack(
  configPath: string,
  port: number,
  project: any,
  sourceDirectory: string,
  importMap: Record<string, string>,
  routes: Record<string, unknown>
) {
  const bundle = getMainBundle(project);
  const host = `http://localhost:${port}`;

  startWebpack(configPath, port, sourceDirectory);
  importMap[project.name] = `${host}/${bundle.name}`;
  routes[project.name] = getAppRoutes(sourceDirectory);
}

export async function runProject(
  basePort: number,
  sourceDirectoryPatterns: Array<string>
): Promise<{
  importMap: Record<string, string>;
  routes: Record<string, unknown>;
}> {
  const baseDir = process.cwd();
  const sourceDirectories = await matchAny(baseDir, sourceDirectoryPatterns);
  const importMap = {};
  const routes = {};

  logInfo("Loading dynamic import map ...");

  for (let i = 0; i < sourceDirectories.length; i++) {
    const sourceDirectory = resolve(baseDir, sourceDirectories[i]);
    const projectFile = resolve(sourceDirectory, "package.json");
    const configPath = resolve(sourceDirectory, "webpack.config.js");
    const port = basePort + i + 1;

    logInfo(`Looking in directory "${sourceDirectory}" ...`);

    if (!existsSync(projectFile)) {
      logFail(
        `No "package.json" found in directory "${sourceDirectory}". Skipping ...`
      );
      continue;
    }

    const project = require(projectFile);
    const startup = project["openmrs:develop"];

    if (typeof startup === "object") {
      // detected specialized startup command
      const cp = exec(startup.command, {
        cwd: sourceDirectory,
      });
      cp.stdout?.pipe(process.stdout);
      cp.stderr?.pipe(process.stderr);
      // connect to either startup.url or a computed value based on startup.host
      importMap[project.name] =
        startup.url || `${startup.host}/${basename(project.browser)}`;
    } else if (!existsSync(configPath)) {
      // try to locate and run via default webpack
      logWarn(
        `No "webpack.config.js" found in directory "${sourceDirectory}". Trying to use default config ...`
      );

      runProjectWebpack(
        defaultConfigPath,
        port,
        project,
        sourceDirectory,
        importMap,
        routes
      );
    } else {
      // run via specialized webpack.config.js
      runProjectWebpack(
        configPath,
        port,
        project,
        sourceDirectory,
        importMap,
        routes
      );
    }
  }

  logInfo(
    `Assembled dynamic import map (${Object.keys(importMap).join(", ")}).`
  );

  return { importMap, routes };
}

/**
 * @param decl The initial import map declaration
 * @param additionalImports New imports to add
 * @returns The import map declaration with the new imports added in. If
 *   there are new imports to add, and if the original import map declaration
 *   had type "url", it is downloaded and resolved to one of type "inline".
 */
export async function mergeImportmapAndRoutes(
  importAndRoutes: ImportmapAndRoutes,
  additionalImportsAndRoutes:
    | { importMap: Record<string, string>; routes: Record<string, unknown> }
    | false,
  backend?: string,
  spaPath?: string
): Promise<ImportmapAndRoutes> {
  const { importMap: importDecl, routes: routesDecl } = importAndRoutes;
  const { importMap: additionalImports, routes: additionalRoutes } =
    additionalImportsAndRoutes || {};

  let mergedRoutes = routesDecl;

  if (additionalImports && Object.keys(additionalImports).length > 0) {
    if (importDecl.type === "url") {
      importDecl.type = "inline";
      importDecl.value = await readImportmap(
        importDecl.value,
        backend,
        spaPath
      );
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
    mergedRoutes = { ...routesDecl, ...additionalRoutes };
  }

  return { importMap: importDecl, routes: mergedRoutes };
}

export async function getImportmapAndRoutes(
  importMapPath: string,
  basePort?: number
): Promise<ImportmapAndRoutes> {
  if (importMapPath === "@" && basePort) {
    logWarn(
      'Using the "@" import map is deprecated. Switch to use the "--run-project" flag.'
    );

    const imports = await runProject(basePort, ["."]);

    return {
      importMap: {
        type: "inline",
        value: JSON.stringify({
          imports,
        }),
      },
      routes: coreRoutes,
    };
  } else if (!/https?:\/\//.test(importMapPath)) {
    const path = resolve(process.cwd(), importMapPath);

    if (existsSync(path)) {
      const content = readFileSync(path, "utf8");
      const valid = checkImportmapJson(content);

      if (!valid) {
        logWarn(
          `The import map provided in "${importMapPath}" does not seem right. Skipping.`
        );
      }

      return {
        importMap: {
          type: "inline",
          value: valid ? content : "",
        },
        routes: coreRoutes,
      };
    } else if (checkImportmapJson(importMapPath)) {
      return {
        importMap: {
          type: "inline",
          value: importMapPath,
        },
        routes: coreRoutes,
      };
    }
  }

  return {
    importMap: {
      type: "url",
      value: importMapPath,
    },
    routes: coreRoutes,
  };
}

/**
 * @param decl An import map declaration of type "inline"
 * @param backend The backend which is being proxied by the dev server
 * @param host The dev server host
 * @param port The dev server port
 * @returns The same import map declaration but with all imports from
 *   `backend` changed to import from `http://${host}:${port}`.
 */
export function proxyImportmapAndRoutes(
  importmapAndRoutes: ImportmapAndRoutes,
  backend: string,
  host: string,
  port: number
) {
  const { importMap: decl, routes } = importmapAndRoutes;
  if (decl.type != "inline") {
    throw new Error(
      "proxyImportMap called on non-inline import map. This is a programming error. Value: " +
        decl.value
    );
  }
  const importmap = JSON.parse(decl.value);
  Object.keys(importmap.imports).forEach((key) => {
    const url = importmap.imports[key];
    if (url.startsWith(backend)) {
      importmap.imports[key] = url.replace(backend, `http://${host}:${port}`);
    }
  });
  decl.value = JSON.stringify(importmap);
  return { importmap: decl, routes };
}
