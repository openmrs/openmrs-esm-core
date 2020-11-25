import "./style";
import type { SpaConfig } from "./types";

function wireSpaPaths() {
  const baseElement = document.createElement("base");
  baseElement.href = window.getOpenmrsSpaBase();
  document.head.appendChild(baseElement);
  __webpack_public_path__ = window.spaBase;
}

function setupPaths(config: SpaConfig) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || "production";
  window.spaVersion = process.env.BUILD_VERSION;
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

function runSpa() {
  const { run } = require("./run");
  return run();
}

/**
 * Initializes the OpenMRS Microfrontend App Shell.
 * @param config The global configuration to apply.
 */
export function initializeSpa(config: SpaConfig) {
  setupPaths(config);
  wireSpaPaths();
  return runSpa();
}
