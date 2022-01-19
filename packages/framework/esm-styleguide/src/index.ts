import { setupLogo } from "./logo";
import { setupIcons } from "./icons";
import { defineConfigSchema, getConfigStore, Type } from "@openmrs/esm-config";

export * from "./breakpoints";
export * from "./spinner";
export * from "./notifications";
export * from "./toasts";
export * from "./modals";

setupLogo();
setupIcons();

defineConfigSchema("@openmrs/esm-styleguide", {
  "Primary brand color": {
    _default: "#005d5d",
    _type: Type.String,
  },
});

getConfigStore("@openmrs/esm-styleguide").subscribe((store) => {
  if (store.loaded && store.config) {
    setGlobalCSSVariable("--brand-01", store.config["Primary brand color"]);
  }
});

function setGlobalCSSVariable(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}
