import "./logo.css";
import fullLogo from "./openmrs-logo-full.svg";
import partialLogo from "./openmrs-logo-partial.svg";
import iconLogo from "./openmrs-logo-icon.svg";
import { addSvg } from "../svg-utils";

addSvg("omrs-logo-full-color", fullLogo);
addSvg("omrs-logo-full-mono", fullLogo);
addSvg("omrs-logo-partial-color", partialLogo);
addSvg("omrs-logo-partial-mono", partialLogo);
addSvg("omrs-logo-icon-color", iconLogo);
addSvg("omrs-logo-icon-mono", iconLogo);
