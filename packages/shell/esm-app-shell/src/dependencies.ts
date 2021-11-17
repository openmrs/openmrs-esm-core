import * as dayjs from "dayjs";
import * as i18next from "i18next";
import * as react from "react";
import * as reactDom from "react-dom";
import * as reactRouterDom from "react-router-dom";
import * as reactI18next from "react-i18next";
import * as singleSpa from "single-spa";
import * as openmrsEsmFramework from "@openmrs/esm-framework";
import * as carbonComponents from "carbon-components";
import * as carbonIcons from "carbon-icons";
import * as rxjs from "rxjs";

// legacy way of dependency sharing - still done for backwards compatibility
export const sharedDependencies = {
  dayjs: () => dayjs,
  i18next: () => i18next,
  react: () => react,
  "react-dom": () => reactDom,
  "react-router-dom": () => reactRouterDom,
  "react-i18next": () => reactI18next,
  "single-spa": () => singleSpa,
  "@openmrs/esm-api": () => openmrsEsmFramework,
  "@openmrs/esm-app-shell": () => ({}),
  "@openmrs/esm-breadcrumbs": () => openmrsEsmFramework,
  "@openmrs/esm-config": () => openmrsEsmFramework,
  "@openmrs/esm-module-config": () => openmrsEsmFramework,
  "@openmrs/esm-context": () => openmrsEsmFramework,
  "@openmrs/esm-error-handling": () => openmrsEsmFramework,
  "@openmrs/esm-extensions": () => openmrsEsmFramework,
  "@openmrs/esm-extension-manager": () => openmrsEsmFramework,
  "@openmrs/esm-framework": () => openmrsEsmFramework,
  "@openmrs/esm-globals": () => openmrsEsmFramework,
  "@openmrs/esm-react-utils": () => openmrsEsmFramework,
  "@openmrs/esm-state": () => openmrsEsmFramework,
  "@openmrs/esm-styleguide": () => openmrsEsmFramework,
  "@openmrs/esm-utils": () => openmrsEsmFramework,
  "@openmrs/esm-offline": () => openmrsEsmFramework,
  "carbon-components": () => carbonComponents,
  "carbon-icons": () => carbonIcons,
  rxjs: () => rxjs,
};
