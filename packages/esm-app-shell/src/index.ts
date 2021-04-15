import "@openmrs/esm-styleguide/dist/openmrs-esm-styleguide.css";
import { setupPaths, setupUtils, SpaConfig } from "@openmrs/esm-framework";
import { Workbox } from "workbox-window";

declare var __webpack_public_path__: string;

function wireSpaPaths() {
  const baseElement = document.createElement("base");
  const baseHref = window.getOpenmrsSpaBase();
  baseElement.href = baseHref;
  document.head.appendChild(baseElement);
  __webpack_public_path__ = baseHref;
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox(`${window.getOpenmrsSpaBase()}service-worker.js`);
    wb.register();

    window.addEventListener("load", () => {
      if (navigator.onLine) {
        window.importMapOverrides.getCurrentPageMap().then((importMap) => {
          wb.messageSW({
            type: "onImportMapChanged",
            importMap,
          });
        });
      }
    });

    wb.messageSW({
      type: "setOmrsPaths",
      paths: {
        openmrsBase: window.openmrsBase,
        spaBase: window.spaBase,
        spaEnv: window.spaEnv,
        spaVersion: window.spaVersion,
      },
    });
  }
}

function runSpa(config: SpaConfig) {
  const { configUrls = [] } = config;
  const { run } = require("./run");
  return run(configUrls);
}

/**
 * Initializes the OpenMRS Microfrontend App Shell.
 * @param config The global configuration to apply.
 */
export function initializeSpa(config: SpaConfig) {
  setupUtils();
  setupPaths(config);
  wireSpaPaths();
  registerServiceWorker();
  return runSpa(config);
}
