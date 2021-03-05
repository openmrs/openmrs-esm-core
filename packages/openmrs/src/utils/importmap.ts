import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { logFail, logInfo, logWarn } from "./logger";
import { startWebpack } from "./webpack";
import { getDependentModules, getMainBundle } from "./dependencies";
import axios from "axios";

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

export function runProject(
  basePort: number,
  sharedDependencies: Array<string>
): Record<string, string> {
  const projectFile = resolve(process.cwd(), "package.json");

  if (!existsSync(projectFile)) {
    logFail(`No "package.json" found in the current directory.`);
    return process.exit(1);
  }

  const configPath = resolve(process.cwd(), "webpack.config.js");

  if (!existsSync(configPath)) {
    logFail(`No "webpack.config.json" found in the current directory.`);
    return process.exit(1);
  }

  logInfo("Loading dynamic import map ...");

  const project = require(projectFile);
  const port = basePort + 1;
  const bundle = getMainBundle(project);
  const host = `http://localhost:${port}`;
  const dependencies = getDependentModules(
    process.cwd(),
    host,
    project.peerDependencies,
    sharedDependencies
  );

  startWebpack(configPath, port);

  return {
    ...dependencies,
    [project.name]: `${host}/${bundle.name}`,
  };
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

export function getImportmap(
  value: string,
  basePort?: number
): ImportmapDeclaration {
  if (value === "@" && basePort) {
    logWarn(
      'Using the "@" import map is deprecated. Switch to use the "--run-project" flag.'
    );

    return {
      type: "inline",
      value: JSON.stringify({
        imports: runProject(basePort, []),
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
