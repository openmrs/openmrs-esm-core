import { URL } from "url";
import { basename, resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { exec } from "child_process";
import { logFail, logInfo, logWarn } from "./logger";
import { startWebpack } from "./webpack";
import { getMainBundle } from "./dependencies";
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
  importMap: Record<string, string>
) {
  const bundle = getMainBundle(project);
  const host = `http://localhost:${port}`;

  startWebpack(configPath, port, sourceDirectory);
  importMap[project.name] = `${host}/${bundle.name}`;
}

export async function runProject(
  basePort: number,
  sharedDependencies: Array<string>,
  sourceDirectoryPatterns: Array<string>
): Promise<Record<string, string>> {
  const baseDir = process.cwd();
  const sourceDirectories = await matchAny(baseDir, sourceDirectoryPatterns);
  const importMap = {};

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
        importMap
      );
    } else {
      // run via specialized webpack.config.js
      runProjectWebpack(configPath, port, project, sourceDirectory, importMap);
    }
  }

  logInfo(
    `Assembled dynamic import map (${Object.keys(importMap).join(", ")}).`
  );

  return importMap;
}

/**
 * @param decl The initial import map declaration
 * @param additionalImports New imports to add
 * @returns The import map declaration with the new imports added in. If
 *   there are new imports to add, and if the original import map declaration
 *   had type "url", it is downloaded and resolved to one of type "inline".
 */
export async function mergeImportmap(
  decl: ImportmapDeclaration,
  additionalImports: Record<string, string> | false,
  backend?: string,
  spaPath?: string
) {
  if (additionalImports && Object.keys(additionalImports).length > 0) {
    if (decl.type === "url") {
      decl.type = "inline";
      decl.value = await readImportmap(decl.value, backend, spaPath);
    }

    const map = JSON.parse(decl.value);

    decl.value = JSON.stringify({
      imports: {
        ...map.imports,
        ...additionalImports,
      },
    });
  }

  return decl;
}

export async function getImportmap(
  value: string,
  basePort?: number
): Promise<ImportmapDeclaration> {
  if (value === "@" && basePort) {
    logWarn(
      'Using the "@" import map is deprecated. Switch to use the "--run-project" flag.'
    );

    const imports = await runProject(basePort, [], ["."]);

    return {
      type: "inline",
      value: JSON.stringify({
        imports,
      }),
    };
  } else if (!/https?:\/\//.test(value)) {
    const path = resolve(process.cwd(), value);

    if (existsSync(path)) {
      const content = readFileSync(path, "utf8");
      const valid = checkImportmapJson(content);

      if (!valid) {
        logWarn(
          `The import map provided in "${value}" does not seem right. Skipping.`
        );
      }

      return {
        type: "inline",
        value: valid ? content : "",
      };
    } else if (checkImportmapJson(value)) {
      return {
        type: "inline",
        value,
      };
    }
  }

  return {
    type: "url",
    value,
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
export function proxyImportmap(
  decl: ImportmapDeclaration,
  backend: string,
  host: string,
  port: number
) {
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
  return decl;
}
