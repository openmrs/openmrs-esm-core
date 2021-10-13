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
  configInternalStore,
  defineConfigSchema,
  getExtensionSlotsConfigStore,
  provide,
} from "../../../esm-config/src";
import { render, screen, waitFor } from "@testing-library/react";

describe("Interaction between configuration and extension systems", () => {
  test("Config should create new attachments", async () => {
    registerSimpleExtension("Fred", "esm-flintstone");
    registerSimpleExtension("Barney", "esm-rubble");
    registerExtensionSlot("esm-flintstone", "A slot");
    defineConfigSchema("esm-flintstone", {});
    provide({
      "esm-flintstone": {
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
      disableTranslations: true,
    })(() => <ExtensionSlot extensionSlotName="A slot"></ExtensionSlot>);
    render(<ASlot />);
    await waitFor(() => expect(screen.getByText("Fred")).toBeInTheDocument());
    expect(screen.getByText("Barney")).toBeInTheDocument();
  });
});

function registerSimpleExtension(name: string, moduleName: string) {
  const SimpleComponent = () => <div>{name}</div>;
  registerExtension(name, {
    moduleName,
    load: getSyncLifecycle(SimpleComponent, {
      moduleName,
      featureName: moduleName,
      disableTranslations: true,
    }),
    meta: {},
  });
}
