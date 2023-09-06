import { setupLogo } from "./logo";
import { setupIcons } from "./icons";
import { setupBranding } from "./brand";
import { defineConfigSchema } from "@openmrs/esm-framework";
import { esmStyleGuideSchema } from "./config-schema";

export * from "./breakpoints";
export * from "./spinner";
export * from "./notifications";
export * from "./toasts";
export * from "./modals";
export * from "./left-nav";
export * from "./error-state";
export * from "./datepicker";

defineConfigSchema("@openmrs/esm-styleguide", esmStyleGuideSchema);
setupBranding();
setupLogo();
setupIcons();
