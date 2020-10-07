import { resolve, basename } from "path";
import { existsSync, readFileSync } from "fs";
import { logFail, logWarn } from "./logger";
import { startWebpack } from "./webpack";

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

    const project = require(projectFile);
    const port = basePort + 1;
    const file = basename(project.browser || project.module || project.main);

    startWebpack(configPath, port);

    return {
      type: "inline",
      value: `{ "imports": { "${project.name}": "http://localhost:${port}/${file}" } }`,
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
