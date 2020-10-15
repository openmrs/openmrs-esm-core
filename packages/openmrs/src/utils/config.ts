import { ImportmapDeclaration } from "./importmap";
import { setEnvVariables } from "./variables";

export interface WebpackOptions {
  backend?: string;
  importmap?: ImportmapDeclaration;
  apiUrl?: string;
  spaPath?: string;
  env?: string;
}

export function loadConfig(options: WebpackOptions = {}) {
  const variables: Record<string, any> = {};

  if (typeof options.backend === "string") {
    variables.OMRS_PROXY_TARGET = options.backend;
  }

  if (typeof options.spaPath === "string") {
    variables.OMRS_PUBLIC_PATH = options.spaPath;
  }

  if (typeof options.apiUrl === "string") {
    variables.OMRS_API_URL = options.apiUrl;
  }

  if (typeof options.env === "string") {
    variables.OMRS_ENV = options.env;
    variables.NODE_ENV = options.env;
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
