import React from "react";
import { getSyncLifecycle } from "@openmrs/esm-framework";

export function setupOpenMRS() {
  const moduleName = "@openmrs/esm-test-app-1";

  const options = {
    featureName: "test-1",
    moduleName,
  };

  return {
    pages: [
      {
        load: getSyncLifecycle(() => <div id="test">Hello world</div>, options),
        route: "test",
      },
    ],
  };
}
