import React from "react";
import { getSyncLifecycle } from "@openmrs/esm-framework";

export function setupOpenMRS() {
  const moduleName = "@openmrs/esm-test-page-1-app";

  const options = {
    featureName: "test-1",
    moduleName,
  };

  return {
    pages: [
      {
        load: getSyncLifecycle(
          () => (<div id="hello">Hello world</div>) as any,
          options
        ),
        route: "test",
      },
    ],
  };
}
