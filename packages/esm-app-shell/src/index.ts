import "./style";

import { start } from "single-spa";
import { createAppState, setupApiModule } from "@openmrs/esm-api";
import { setupI18n } from "./locale";
import { registerApp } from "./apps";
import { sharedDependencies } from "./dependencies";
import { loadModules, registerModules } from "./system";
import type { SpaConfig } from "./types";

/**
 * Gets the microfrontend modules (apps). These are entries
 * in the import maps that end with "-app".
 * @param maps The value of the "imports" property of the
 * import maps.
 */
function getApps(maps: Record<string, string>) {
  return Object.keys(maps).filter((m) => m.endsWith("-app"));
}

/**
 * Loads the microfrontends (apps). Should be done *after* the
 * import maps initialized, i.e., after modules loaded.
 */
function loadApps() {
  return window.importMapOverrides
    .getCurrentPageMap()
    .then((importMap) => loadModules(getApps(importMap.imports)));
}

/**
 * Sets up the microfrontends (apps). Uses the defined export
 * from the root modules of the apps, which should export a
 * special function called "setupOpenMRS".
 * This function returns an object that is used to feed Single
 * SPA.
 */
function setupApps(modules: Array<[string, System.Module]>) {
  for (const [appName, appExports] of modules) {
    registerApp(appName, appExports);
  }
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
function runShell() {
  return setupI18n()
    .catch((err) => console.error(`Failed to initialize translations`, err))
    .then(start);
}

function setupPaths(config: SpaConfig) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
}

function handleInitFailure(e: Error) {
  console.error(e);

  if (localStorage.getItem("openmrs:devtools")) {
    renderDevResetButton();
  } else {
    renderApology();
  }
}

function renderApology() {
  const msg = document.createTextNode(
    "Sorry, something has gone as badly as possible"
  );
  document.body.appendChild(msg);
}

function renderDevResetButton() {
  const btn = document.createElement("button");
  btn.addEventListener("click", clearDevOverrides);
  btn.textContent = "Reset dev overrides";
  document.body.appendChild(btn);
}

function clearDevOverrides() {
  for (const key of Object.keys(localStorage)) {
    if (
      key.startsWith("import-map-override:") &&
      !["import-map-override:react", "import-map-override:react-dom"].includes(
        key
      )
    ) {
      localStorage.removeItem(key);
    }
  }
  location.reload();
}

/**
 * Initializes the OpenMRS Microfrontend App Shell.
 * @param config The global configuration to apply.
 */
export function initializeSpa(config: SpaConfig) {
  setupPaths(config);
  registerModules(sharedDependencies);
  setupApiModule();
  createAppState({});
  return loadApps().then(setupApps).then(runShell).catch(handleInitFailure);
}
