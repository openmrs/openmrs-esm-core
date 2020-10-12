import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { logFail, logInfo, logWarn } from "./logger";
import { startWebpack } from "./webpack";
import { getDependentModules, getMainBundle } from "./dependencies";

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

export function getImportmap(
  value: string,
  basePort?: number
): ImportmapDeclaration {
  if (value === "@" && basePort) {
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
      project.peerDependencies
    );

    startWebpack(configPath, port);

    return {
      type: "inline",
      value: JSON.stringify({
        imports: {
          ...dependencies,
          [project.name]: `${host}/${bundle.name}`,
        },
      }),
    };
  } else if (!/https?:\/\//.test(value)) {
    const path = resolve(process.cwd(), value);

    if (existsSync(path)) {
      const content = readFileSync(path, "utf8");
      const valid = checkImportmapJson(content);

      if (!valid) {
        logWarn(
          `The importmap provided in "${value}" does not seem right. Skipping.`
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
