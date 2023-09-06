import { getConfigStore } from "@openmrs/esm-config";

export function setupBranding() {
  getConfigStore("@openmrs/esm-styleguide").subscribe((store) => {
    if (store.loaded && store.config) {
      setGlobalCSSVariable("--brand-01", store.config["Brand color #1"]);
      setGlobalCSSVariable("--brand-02", store.config["Brand color #2"]);
      setGlobalCSSVariable("--brand-03", store.config["Brand color #3"]);
    }
  });

  function setGlobalCSSVariable(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
  }
}
