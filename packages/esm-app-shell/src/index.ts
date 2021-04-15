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

    // By default, cache the session endpoint.
    // This ensures that a lot of user/session related functions also work offline.
    const sessionPathUrl = new URL(
      `${window.openmrsBase}/ws/rest/v1/session`,
      window.location.origin
    ).href;

    wb.messageSW({
      type: "registerDynamicRoute",
      url: sessionPathUrl,
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
