import { defineConfigSchema, Type, validators } from "@openmrs/esm-config";
import { refetchCurrentUser } from "./shared-api-objects/current-user";

/**
 * @internal
 */
export function setupApiModule() {
  defineConfigSchema("@openmrs/esm-api", {
    redirectAuthFailure: {
      enabled: {
        _type: Type.Boolean,
        _default: true,
        _description:
          "Whether to redirect logged-out users to `redirectAuthFailure.url`",
      },
      url: {
        _type: Type.String,
        _default: "${openmrsSpaBase}/login",
        _validators: [validators.isUrl],
      },
      errors: {
        _type: Type.Array,
        _default: [401],
        _elements: {
          _type: Type.Number,
          _validators: [validators.inRange(100, 600)],
        },
        _description: "The HTTP error codes for which users will be redirected",
      },
      resolvePromise: {
        _type: Type.Boolean,
        _default: false,
        _description:
          "Changes how requests that fail authentication are handled. Try messing with this if redirects to the login page aren't working correctly.",
      },
    },
  });

  refetchCurrentUser();
}
