import type { OpenmrsAppRoutes } from "@openmrs/esm-framework";

export type FrontendModule = OpenmrsAppRoutes & {
  name: string;
};
