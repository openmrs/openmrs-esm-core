import { defineConfigSchema, getConfigStore, Type } from "@openmrs/esm-config";

export function setupBranding() {
  defineConfigSchema("@openmrs/esm-styleguide", {
    "Brand color #1": {
      _default: "#005d5d",
      _type: Type.String,
    },
    "Brand color #2": {
      _default: "#004144",
      _type: Type.String,
    },
    "Brand color #3": {
      _default: "#007d79",
      _type: Type.String,
    },
  });

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
