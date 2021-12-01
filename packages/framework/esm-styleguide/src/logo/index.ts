/// <reference path="../declarations.d.ts" />

import fullLogo from "./openmrs-logo-full.svg";
import partialLogo from "./openmrs-logo-partial.svg";
import iconLogo from "./openmrs-logo-icon.svg";
import whiteLogo from "./openmrs-logo-white.svg";
import { addSvg } from "../svg-utils";

export function setupLogo() {
  addSvg("omrs-logo-full-color", fullLogo);
  addSvg("omrs-logo-full-mono", fullLogo);
  addSvg("omrs-logo-full-grey", fullLogo);
  addSvg("omrs-logo-partial-color", partialLogo);
  addSvg("omrs-logo-partial-mono", partialLogo);
  addSvg("omrs-logo-partial-grey", partialLogo);
  addSvg("omrs-logo-icon-color", iconLogo);
  addSvg("omrs-logo-icon-mono", iconLogo);
  addSvg("omrs-logo-icon-grey", iconLogo);
  addSvg("omrs-logo-white", whiteLogo);
}
