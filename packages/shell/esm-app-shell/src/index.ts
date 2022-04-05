import "@openmrs/esm-styleguide/dist/openmrs-esm-styleguide.css";
import {
  setupPaths,
  setupUtils,
  SpaConfig,
} from "@openmrs/esm-framework/src/internal";

declare var __webpack_public_path__: string;

function wireSpaPaths() {
  const baseElement = document.createElement("base");
  const baseHref = window.getOpenmrsSpaBase();
  baseElement.href = baseHref;
  document.head.appendChild(baseElement);
  __webpack_public_path__ = baseHref;
}

function runSpa(config: SpaConfig) {
  const { configUrls = [], offline = true } = config;
  const { run } = require("./run");
  return run(configUrls, offline);
}

/**
 * Initializes the OpenMRS Frontend App Shell.
 * @param config The global configuration to apply.
 */
function initializeSpa(config: SpaConfig) {
  setupUtils();
  setupPaths(config);
  wireSpaPaths();
  return runSpa(config);
}

window.initializeSpa = initializeSpa;
