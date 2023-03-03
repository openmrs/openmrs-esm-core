import type { SpaConfig } from "./types";

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
