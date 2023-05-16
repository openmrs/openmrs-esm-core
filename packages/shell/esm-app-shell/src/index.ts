import "@openmrs/esm-styleguide/dist/openmrs-esm-styleguide.css";
import "import-map-overrides";
import "systemjs/dist/system";
import "systemjs/dist/extras/amd";
import "systemjs/dist/extras/named-exports";
import "systemjs/dist/extras/named-register";
import "systemjs/dist/extras/use-default";
import type { SpaConfig } from "@openmrs/esm-framework/src/internal";

export function setupPaths(config: SpaConfig) {
  window.openmrsBase = config.apiUrl;
  window.spaBase = config.spaPath;
  window.spaEnv = config.env || "production";
  window.spaVersion = process.env.BUILD_VERSION;
  window.getOpenmrsSpaBase = () => `${window.spaBase}/`;
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
