import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

export interface WebpackOptions {
  backend?: string;
  importmap?: ImportmapDeclaration;
}

export interface ImportmapDeclaration {
  type: "inline" | "url";
  value: string;
}

export function setEnvVariables(envVariables: Record<string, any>) {
  Object.keys(envVariables).forEach((key) => {
    process.env[key] = envVariables[key];
  });
}

export function loadConfig(options: WebpackOptions = {}) {
  const variables: Record<string, any> = {};

  if (typeof options.backend === "string") {
    variables.OMRS_PROXY_TARGET = options.backend;
  }

  if (typeof options.importmap === "object") {
    switch (options.importmap.type) {
      case "inline":
        variables.OMRS_ESM_IMPORTMAP = options.importmap.value;
        break;
      case "url":
        variables.OMRS_ESM_IMPORTMAP_URL = options.importmap.value;
        break;
    }
  }

  setEnvVariables(variables);

  return require("@openmrs/esm-app-shell/webpack.config.js");
}

export function checkImportmapJson(value: string) {
  try {
    const content = JSON.parse(value);
    return typeof content === "object" && typeof content.imports === "object";
  } catch {
    return false;
  }
}

export function getImportmap(value: string): ImportmapDeclaration {
  if (!/https?:\/\//.test(value)) {
    const path = resolve(process.cwd(), value);

    if (existsSync(path)) {
      const content = readFileSync(path, "utf8");
      const valid = checkImportmapJson(content);

      if (!valid) {
        console.warn(`The importmap provided in "${value}" does not seem right. Skipping.`);
      }

      return {
        type: "inline",
        value: valid ? content : '',
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
