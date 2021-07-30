import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { logFail, logInfo, logWarn } from "./logger";
import { startWebpack } from "./webpack";
import { getDependentModules, getMainBundle } from "./dependencies";
import axios from "axios";

import glob = require("glob");

async function readImportmap(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return await axios
      .get(path)
      .then((res) => res.data)
      .then((m) => (typeof m !== "string" ? JSON.stringify(m) : m));
  } else if (path === "importmap.json") {
    const path = require.resolve(
      "@openmrs/esm-app-shell/src/assets/importmap.json"
    );
    return readFileSync(path, "utf8");
  }

  return '{"imports":{}}';
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

    logInfo(`Looking in directory "${sourceDirectory}" ...`);

    if (!existsSync(projectFile)) {
      logFail(
        `No "package.json" found in directory "${sourceDirectory}". Skipping ...`
      );
      continue;
    }

    if (!existsSync(configPath)) {
      logFail(
        `No "webpack.config.json" found in directory "${sourceDirectory}". Skipping ...`
      );
      continue;
    }

    const project = require(projectFile);
    const port = basePort + i + 1;
    const bundle = getMainBundle(project);
    const host = `http://localhost:${port}`;
    const dependencies = getDependentModules(
      process.cwd(),
      host,
      project.peerDependencies,
      sharedDependencies
    );

    startWebpack(configPath, port, sourceDirectory);

    Object.assign(importMap, dependencies);
    importMap[project.name] = `${host}/${bundle.name}`;
  }

  logInfo(
    `Assembled dynamic import map (${Object.keys(importMap).join(", ")}).`
  );

  return importMap;
}

export async function mergeImportmap(
  decl: ImportmapDeclaration,
  imports: Record<string, string> | false
) {
  if (imports && Object.keys(imports).length > 0) {
    if (decl.type === "url") {
      decl.type = "inline";
      decl.value = await readImportmap(decl.value);
    }

    const map = JSON.parse(decl.value);

    decl.value = JSON.stringify({
      imports: {
        ...map.imports,
        ...imports,
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
