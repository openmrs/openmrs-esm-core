import * as dayjs from "dayjs";
import * as i18next from "i18next";
import * as react from "react";
import * as reactDom from "react-dom";
import * as reactRouterDom from "react-router-dom";
import * as reactI18next from "react-i18next";
import * as singleSpa from "single-spa";
// Load @openmrs/esm-framework/src/internal because it is a superset
// of @openmrs/esm-framework. There's no point loading both.
import * as openmrsEsmFrameworkInternal from "@openmrs/esm-framework/src/internal";
import * as carbonComponents from "@carbon/react";
import * as rxjs from "rxjs";

(window as any).esmFrameworkInternal = openmrsEsmFrameworkInternal;

// legacy way of dependency sharing - still done for backwards compatibility
export const sharedDependencies = {
  dayjs: () => dayjs,
  i18next: () => i18next,
  react: () => react,
  "react-dom": () => reactDom,
  "react-router-dom": () => reactRouterDom,
  "react-i18next": () => reactI18next,
  "single-spa": () => singleSpa,
  "@openmrs/esm-api": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-app-shell": () => ({}),
  "@openmrs/esm-breadcrumbs": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-config": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-module-config": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-context": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-error-handling": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-extensions": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-extension-manager": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-framework": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-framework/src/internal": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-globals": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-react-utils": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-state": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-styleguide": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-utils": () => openmrsEsmFrameworkInternal,
  "@openmrs/esm-offline": () => openmrsEsmFrameworkInternal,
  "carbon-components": () => carbonComponents,
  rxjs: () => rxjs,
};