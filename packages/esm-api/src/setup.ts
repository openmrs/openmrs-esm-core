import { defineConfigSchema } from "@openmrs/esm-config";
import { refetchCurrentUser } from "./shared-api-objects/current-user";

export function setupApiModule() {
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

  refetchCurrentUser();
}
