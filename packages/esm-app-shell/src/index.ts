import { loadModules } from "./system";
import { ExtensionDefinition } from "@openmrs/esm-extension-manager";
import { setupI18n } from "./locale";
import {
  routePrefix,
  Activator,
  ActivatorDefinition,
  routeRegex,
} from "./helpers";

declare global {
  interface Window extends SpaConfig {
    getOpenmrsSpaBase(): string;
    importMapOverrides: {
      getCurrentPageMap: () => Promise<ImportMap>;
    };
  }
}

interface ImportMap {
  imports: Record<string, string>;
}

export interface SpaConfig {
  /**
   * The base path for the OpenMRS API / endpoints.
   */
  openmrsBase: string;
  /**
   * The base path for the SPA root path.
   */
  spaBase: string;
  /**
   * The names of additional modules to load initially,
   * if any.
   */
  coreLibs?: Array<string>;
}

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
 * Normalizes the activator function, i.e., if we receive a
 * string we'll prepend the SPA base (prefix). We'll also handle
 * the case of a supplied array.
 * @param activator The activator to preprocess.
 */
function preprocessActivator(
  activator: ActivatorDefinition | Array<ActivatorDefinition>
): Activator {
  if (Array.isArray(activator)) {
    const activators = activator.map(preprocessActivator);
    return (location) => activators.some((activator) => activator(location));
  } else if (typeof activator === "string") {
    return (location) => routePrefix(activator, location);
  } else if (activator instanceof RegExp) {
    return (location) => routeRegex(activator, location);
  } else {
    return activator;
  }
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
    const setup = appExports.setupOpenMRS;

    if (typeof setup === "function") {
      const result = setup();

      if (result && typeof result === "object") {
        System.import("single-spa").then(({ registerApplication }) => {
          System.import("@openmrs/esm-extension-manager").then(
            ({ registerExtension }) => {
              const availableExtensions: Array<ExtensionDefinition> =
                result.extensions ?? [];

              for (const { name, load } of availableExtensions) {
                registerExtension({ name, load, appName });
              }

              registerApplication(
                appName,
                result.lifecycle,
                preprocessActivator(result.activate)
              );
            }
          );
        });
      }
    }
  }
}

/**
 * Runs the shell by importing the translations and starting single SPA.
 */
function runShell() {
  return System.import("single-spa").then(({ start }) => {
    return setupI18n()
      .catch((err) => console.error(`Failed to initialize translations`, err))
      .then(start);
  });
}

/**
 * Initializes the OpenMRS Microfrontend App Shell.
 * @param config The global configuration to apply.
 */
export function initializeSpa(config: SpaConfig) {
  const libs = [
    "single-spa",
    "@openmrs/esm-styleguide",
    "@openmrs/esm-extension-manager",
  ];

  window.openmrsBase = config.openmrsBase;
  window.spaBase = config.spaBase;
  window.getOpenmrsSpaBase = () => `${window.openmrsBase}${window.spaBase}/`;

  return loadModules(libs)
    .then(loadApps)
    .then(setupApps)
    .then(runShell)
    .catch(handleInitFailure);
}

function handleInitFailure() {
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
  document.appendChild(msg);
}

function renderDevResetButton() {
  const btn = document.createElement("button");
  btn.onclick = clearDevOverrides;
  btn.innerHTML = "Reset dev overrides";
  document.body.appendChild(btn);
}

function clearDevOverrides() {
  for (let key of Object.keys(localStorage)) {
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
