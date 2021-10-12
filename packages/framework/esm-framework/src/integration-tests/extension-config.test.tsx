import React from "react";
import {
  extensionStore,
  registerExtension,
  registerExtensionSlot,
} from "../../../esm-extensions";
import {
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
} from "../../../esm-react-utils/src";
import {
  defineConfigSchema,
  getExtensionSlotsConfigStore,
  provide,
} from "../../../esm-config/src";
import { render, screen, waitFor } from "@testing-library/react";

describe("Interaction between configuration and extension systems", () => {
  test("Config should create new attachments", async () => {
    extensionStore.subscribe((state) => {
      console.log(state.slots);
    });
    getExtensionSlotsConfigStore("esm-flintstone").subscribe((state) =>
      console.log(state)
    );
    registerSimpleExtension("Fred", "esm-flintstone");
    registerSimpleExtension("Barney", "esm-rubble");
    registerExtensionSlot("esm-flintstone", "A slot");
    defineConfigSchema("esm-flintstone", {});
    provide({
      Flintstone: {
        extensions: {
          "A slot": {
            add: ["Fred", "Barney"],
          },
        },
      },
    });
    const ASlot = openmrsComponentDecorator({
      moduleName: "esm-flintstone",
      featureName: "The Flintstones",
    })(() => <ExtensionSlot extensionSlotName="A slot"></ExtensionSlot>);
    render(<ASlot></ASlot>);
    await waitFor(() => expect(screen.getByText("Fred")).toBeVisible());
  });
});

function registerSimpleExtension(name: string, moduleName: string) {
  const SimpleComponent = () => <div>{name}</div>;
  registerExtension(name, {
    moduleName,
    load: getSyncLifecycle(SimpleComponent, {
      moduleName,
      featureName: moduleName,
    }),
    meta: {},
  });
}
