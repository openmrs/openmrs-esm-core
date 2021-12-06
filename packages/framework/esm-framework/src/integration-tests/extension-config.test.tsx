import React from "react";
import {
  attach,
  registerExtension,
  registerExtensionSlot,
} from "../../../esm-extensions";
import {
  Extension,
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
  useConfig,
} from "../../../esm-react-utils/src";
import { defineConfigSchema, provide, Type } from "../../../esm-config/src";
import { render, screen, waitFor } from "@testing-library/react";

describe("Interaction between configuration and extension systems", () => {
  test("Config should add, order, and remove extensions within slots", async () => {
    registerSimpleExtension("Fred", "esm-flintstone");
    registerSimpleExtension("Wilma", "esm-flintstone");
    registerSimpleExtension("Barney", "esm-rubble");
    registerSimpleExtension("Betty", "esm-rubble");
    registerExtensionSlot("esm-flintstone", "A slot");
    attach("A slot", "Fred");
    attach("A slot", "Wilma");
    defineConfigSchema("esm-flintstone", {});
    provide({
      "esm-flintstone": {
        extensions: {
          "A slot": {
            add: ["Barney", "Betty"],
            order: ["Betty", "Wilma"],
            remove: ["Fred"],
          },
        },
      },
    });
    const App = openmrsComponentDecorator({
      moduleName: "esm-flintstone",
      featureName: "The Flintstones",
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" extensionSlotName="A slot" />);
    render(<App />);
    await waitFor(() => expect(screen.getByText("Betty")).toBeInTheDocument());
    const slot = screen.getByTestId("slot");
    const extensions = slot.childNodes;
    expect(extensions[0]).toHaveTextContent("Betty");
    expect(extensions[1]).toHaveTextContent("Wilma");
    expect(extensions[2]).toHaveTextContent("Barney");
    expect(screen.queryByText("Fred")).not.toBeInTheDocument();
  });

  test("Extensions should recieve config from module and from 'configure' key", async () => {
    registerSimpleExtension("Wilma", "esm-flintstone", true);
    registerExtensionSlot("esm-flintstone", "Flintstone slot");
    registerExtensionSlot("esm-flintstone", "Future slot");
    defineConfigSchema("esm-flintstone", {
      town: { _type: Type.String, _default: "Bedrock" },
    });
    attach("Flintstone slot", "Wilma");
    attach("Future slot", "Wilma");
    provide({
      "esm-flintstone": {
        town: "Springfield",
        extensions: {
          "Future slot": {
            configure: {
              Wilma: {
                town: "New New York",
              },
            },
          },
        },
      },
    });
    const App = openmrsComponentDecorator({
      moduleName: "esm-flintstone",
      featureName: "The Flintstones",
      disableTranslations: true,
    })(() => (
      <>
        <ExtensionSlot
          data-testid="flintstone-slot"
          extensionSlotName="Flintstone slot"
        />
        <ExtensionSlot
          data-testid="future-slot"
          extensionSlotName="Future slot"
        />
      </>
    ));
    render(<App />);
    await screen.findAllByText(/.*Wilma.*/);
    const flintstoneWilma = screen.getByTestId("flintstone-slot");
    expect(flintstoneWilma).toHaveTextContent(/Wilma:.*Springfield/);
    const futureWilma = screen.getByTestId("future-slot");
    expect(futureWilma).toHaveTextContent(/Wilma:.*New New York/);
  });
});

function registerSimpleExtension(
  name: string,
  moduleName: string,
  takesConfig: boolean = false
) {
  const SimpleComponent = () => <div>{name}</div>;
  const ConfigurableComponent = () => {
    const config = useConfig();
    return (
      <div>
        {name}: {JSON.stringify(config)}
      </div>
    );
  };
  registerExtension(name, {
    moduleName,
    load: getSyncLifecycle(
      takesConfig ? ConfigurableComponent : SimpleComponent,
      {
        moduleName,
        featureName: moduleName,
        disableTranslations: true,
      }
    ),
    meta: {},
  });
}
