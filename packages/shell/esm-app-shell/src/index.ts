import "@openmrs/esm-styleguide/dist/openmrs-esm-styleguide.css";
import "import-map-overrides";
import "@openmrs/esm-framework";
import type { SpaConfig } from "@openmrs/esm-framework/src/internal";

export function setupPaths(config: SpaConfig) {
  let error = false;
  if (!config.apiUrl) {
    console.error(
      "initializeSpa() was called without supplying an apiUrl. This means that the application cannot communicate with the backend."
    );
    error = true;
  }

  if (!config.spaPath) {
    console.error(
      "initializeSpa() was called without supplying a spaPath. This means that the application cannot properly generate urls."
    );
    error = true;
  }

  if (error) {
    throw new Error(
      "One or more required properties in the basic configuration of the application was missing and the application cannot be rendered. Please see the browser console for details."
    );
  }

  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || "production";
  window.spaVersion = process.env.BUILD_VERSION;
  const spaBaseWithSlash = window.spaBase.endsWith("/")
    ? window.spaBase
    : window.spaBase + "/";
  window.getOpenmrsSpaBase = () => spaBaseWithSlash;
}

export function setupUtils() {
  window.copyText = (source: HTMLElement) => {
    const sel = window.getSelection();

    if (sel) {
      const r = document.createRange();
      r.selectNode(source);
      sel.removeAllRanges();
      sel.addRange(r);
      document.execCommand("copy");
      sel.removeAllRanges();
    }
  };
}

function wireSpaPaths() {
  const baseElement = document.createElement("base");
  const baseHref = window.getOpenmrsSpaBase();
  baseElement.href = baseHref;
  document.head.appendChild(baseElement);
  __webpack_public_path__ = baseHref;
}

/**
 * Initializes the OpenMRS Frontend App Shell.
 * @param config The global configuration to apply.
 */
function initializeSpa(config: SpaConfig) {
  setupUtils();
  setupPaths(config);
  wireSpaPaths();
  return Promise.resolve(__webpack_init_sharing__("default")).then(async () => {
    const { configUrls = [], offline = true } = config;
    const { run } = await import("./run");
    return run(configUrls, offline);
  });
}

window.initializeSpa = initializeSpa;
