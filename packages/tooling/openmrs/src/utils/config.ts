import { ImportmapDeclaration } from "./importmap";
import { setEnvVariables } from "./variables";
import type { Configuration as WebpackConfig } from "webpack";

export interface WebpackOptions {
  backend?: string;
  defaultLocale?: string;
  importmap?: ImportmapDeclaration;
  apiUrl?: string;
  spaPath?: string;
  pageTitle?: string;
  supportOffline?: boolean;
  configUrls?: Array<string>;
  env?: string;
  coreAppsDir?: string;
  addCookie?: string;
  fresh?: boolean;
}

export function loadWebpackConfig(options: WebpackOptions = {}) {
  const variables: Record<string, unknown> = {};

  if (typeof options.backend === "string") {
    variables.OMRS_PROXY_TARGET = options.backend;
  }

  if (typeof options.spaPath === "string") {
    variables.OMRS_PUBLIC_PATH = options.spaPath;
  }

  if (typeof options.apiUrl === "string") {
    variables.OMRS_API_URL = options.apiUrl;
  }

  if (typeof options.pageTitle === "string") {
    variables.OMRS_PAGE_TITLE = options.pageTitle;
  }

  if (typeof options.addCookie === "string") {
    variables.OMRS_ADD_COOKIE = options.addCookie;
  }

  if (typeof options.supportOffline === "boolean") {
    variables.OMRS_OFFLINE = options.supportOffline ? "enable" : "disable";
  }

  if (Array.isArray(options.configUrls)) {
    variables.OMRS_CONFIG_URLS = options.configUrls.join(";");
  }

  if (typeof options.env === "string") {
    variables.OMRS_ENV = options.env;
    variables.NODE_ENV = options.env;
  }

  if (typeof options.defaultLocale === "string") {
    variables.OMRS_ESM_DEFAULT_LOCALE = options.defaultLocale;
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

  if (typeof options.coreAppsDir === "string") {
    variables.OMRS_ESM_CORE_APPS_DIR = options.coreAppsDir;
  }

  if (typeof options.fresh === "boolean") {
    variables.OMRS_CLEAN_BEFORE_BUILD = options.fresh;
  }

  setEnvVariables(variables);

  const config:
    | ((env: Record<string, unknown>) => WebpackConfig)
    | WebpackConfig = require("@openmrs/esm-app-shell/webpack.config.js");

  if (typeof config === "function") {
    return config({});
  }

  return config;
}
