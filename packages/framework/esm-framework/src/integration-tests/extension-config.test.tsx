import React from "react";
import {
  attach,
  extensionStore,
  registerExtension,
  registerExtensionSlot,
} from "../../../esm-extensions";
import {
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
  useConfig,
} from "../../../esm-react-utils/src";
import {
  configInternalStore,
  defineConfigSchema,
  getExtensionSlotsConfigStore,
  provide,
  Type,
} from "../../../esm-config/src";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

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
    const App = openmrsComponentDecorator({
      moduleName: "esm-flintstone",
      featureName: "The Flintstones",
      disableTranslations: true,
    })(() => <ExtensionSlot extensionSlotName="A slot"/>);
    render(<App />);
    await waitFor(() => expect(screen.getByText("Fred")).toBeInTheDocument());
    expect(screen.getByText("Barney")).toBeInTheDocument();
  });

  test("Extensions should recieve config from module and from 'configure' key", async () => {
    registerSimpleExtension("Wilma", "esm-flintstone", true);
    registerExtensionSlot("esm-flintstone", "Flintstone slot");
    registerExtensionSlot("esm-dinosaurs", "Dino slot");
    defineConfigSchema("esm-flintstone", { town: { _type: Type.String, _default: "Bedrock" } });
    attach("Flintstone slot", "Wilma");
    attach("Dino slot", "Wilma");
    provide({
      "esm-flintstone": {
        town: "Springfield",
      },
      "esm-dinosaurs": {
        extensions: {
        "Dino slot": {
          configure: {
            Wilma: {
              town: "Narnia"
            }
          }
        },
      },
      },
    });
    const App = openmrsComponentDecorator({
      moduleName: "esm-flintstone",
      featureName: "The Flintstones",
      disableTranslations: true,
    })(() => <>
      <ExtensionSlot data-testid="flintstone-slot" extensionSlotName="Flintstone slot" />
      <ExtensionSlot data-testid="dino-slot" extensionSlotName="Dino slot" />
      </>);
    render(<App />);
    await screen.findAllByText(/.*Wilma.*/);
    const flintstoneWilma = screen.getByTestId("flintstone-slot");
    expect(flintstoneWilma).toHaveTextContent(/Wilma:.*Springfield/);
    const dinoWilma = screen.getByTestId("dino-slot");
    expect(dinoWilma).toHaveTextContent(/Wilma:.*Narnia/);
  });
});

function registerSimpleExtension(name: string, moduleName: string, takesConfig: boolean = false) {
  const SimpleComponent = () => <div>{name}</div>;
  const ConfigurableComponent = () => {
    const config = useConfig();
    return <div>{name}: {JSON.stringify(config)}</div>
  }
  registerExtension(name, {
    moduleName,
    load: getSyncLifecycle(takesConfig ? ConfigurableComponent : SimpleComponent, {
      moduleName,
      featureName: moduleName,
      disableTranslations: true,
    }),
    meta: {},
  });
}
