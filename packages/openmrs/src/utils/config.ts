import { ImportmapDeclaration } from "./importmap";
import { setEnvVariables } from "./variables";

export interface WebpackOptions {
  backend?: string;
  importmap?: ImportmapDeclaration;
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
