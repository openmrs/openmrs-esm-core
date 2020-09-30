import { defineConfigSchema } from "@openmrs/esm-config";

defineConfigSchema("@openmrs/esm-api", {
  redirectAuthFailure: {
    enabled: {
      default: true,
    },
    url: {
      //@ts-ignore
      default: window.getOpenmrsSpaBase() + "login",
    },
    errors: {
      default: [401],
    },
    resolvePromise: {
      default: false,
    },
  },
});

export { default as UserHasAccessReact } from "./shared-api-objects/user-has-access-react.component";
export { default as ExtensionSlotReact } from "./shared-api-objects/extension-slot-react.component";

export * from "./types";
export * from "./openmrs-fetch";
export * from "./fhir";
export * from "./state";

export * from "./shared-api-objects/current-user";
export * from "./shared-api-objects/current-patient";
export * from "./shared-api-objects/use-current-patient.hook";

export * from "./openmrs-backend-dependencies";
export * from "./workspace/workspace.resource";
