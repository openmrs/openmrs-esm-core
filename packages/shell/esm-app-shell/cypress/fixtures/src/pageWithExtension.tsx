import React from "react";
import { ExtensionSlot, getSyncLifecycle } from "@openmrs/esm-framework";

export function setupOpenMRS() {
  const moduleName = "@openmrs/esm-test-app-2";

  const options = {
    featureName: "test-2",
    moduleName,
  };

  return {
    pages: [
      {
        load: getSyncLifecycle(
          () => (
            <div id="test">
              <ExtensionSlot extensionSlotName="box" />
            </div>
          ),
          options
        ),
        route: "test",
      },
    ],
    extensions: [
      {
        name: "hey worldo",
        load: getSyncLifecycle(() => <div>hey worldo</div>, options),
        slot: "box",
      },
    ],
  };
}
