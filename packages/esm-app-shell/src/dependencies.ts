export const sharedDependencies = {
  i18next: () => require("i18next"),
  react: () => require("react"),
  "react-dom": () => require("react-dom"),
  "react-router-dom": () => require("react-router-dom"),
  "react-i18next": () => require("react-i18next"),
  "single-spa": () => require("single-spa"),
  "@openmrs/esm-api": () => import("@openmrs/esm-api"),
  "@openmrs/esm-error-handling": () => import("@openmrs/esm-error-handling"),
  "@openmrs/esm-module-config": () => import("@openmrs/esm-module-config"),
  "@openmrs/esm-extension-manager": () =>
    require("@openmrs/esm-extension-manager"),
  "@openmrs/esm-styleguide": () => require("@openmrs/esm-styleguide"),
  "carbon-components": () => import("carbon-components"),
  "carbon-icons": () => import("carbon-icons"),
  rxjs: () => import("rxjs"),
};
