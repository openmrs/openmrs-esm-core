import React from "react";
import {
  attach,
  registerExtension,
  updateInternalExtensionStore,
  getExtensionInternalStore,
  getExtensionStore,
} from "../../../esm-extensions";
import {
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
  useConfig,
  useExtensionStore,
} from "../../../esm-react-utils/src";
import {
  defineConfigSchema,
  provide,
  Type,
  temporaryConfigStore,
  configInternalStore,
  getExtensionSlotsConfigStore,
} from "../../../esm-config/src";
import { act, render, screen, waitFor } from "@testing-library/react";
import { waitForElementToBeRemoved } from "@testing-library/dom";

describe("Interaction between configuration and extension systems", () => {
  beforeEach(() => {
    temporaryConfigStore.setState({ config: {} });
    configInternalStore.setState({ providedConfigs: [], schemas: {} });
    getExtensionSlotsConfigStore().setState({ slots: {} });
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
  });

  test("Config should add, order, and remove extensions within slots", async () => {
    registerSimpleExtension("Fred", "esm-flintstone");
    registerSimpleExtension("Wilma", "esm-flintstone");
    registerSimpleExtension("Barney", "esm-rubble");
    registerSimpleExtension("Betty", "esm-rubble");
    attach("A slot", "Fred");
    attach("A slot", "Wilma");
    defineConfigSchema("esm-flintstone", {});
    provide({
      "esm-flintstone": {
        extensionSlots: {
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
    defineConfigSchema("esm-flintstone", {
      town: { _type: Type.String, _default: "Bedrock" },
    });
    attach("Flintstone slot", "Wilma");
    attach("Future slot", "Wilma");
    provide({
      "esm-flintstone": {
        town: "Springfield",
        extensionSlots: {
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

  test("Should be possible to attach the same extension twice with different configurations", async () => {
    registerSimpleExtension("pet", "esm-characters", true);
    defineConfigSchema("esm-characters", {
      name: { _type: Type.String, _default: "(no-name)" },
    });
    attach("Flintstone slot", "pet#Dino");
    attach("Flintstone slot", "pet#BabyPuss");
    provide({
      "esm-flintstone": {
        extensionSlots: {
          "Flintstone slot": {
            configure: {
              "pet#Dino": {
                name: "Dino",
              },
              "pet#BabyPuss": {
                name: "Baby Puss",
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
      </>
    ));
    render(<App />);
    await screen.findAllByText(/.*Dino.*/);
    const slot = screen.getByTestId("flintstone-slot");
    expect(slot.firstChild).toHaveTextContent(/Dino/);
    expect(slot.lastChild).toHaveTextContent(/Baby Puss/);
  });

  test("Slot config should update with temporary config", async () => {
    registerSimpleExtension("Pearl", "esm-slaghoople");
    attach("A slot", "Pearl");
    defineConfigSchema("esm-slaghoople", {});
    const App = openmrsComponentDecorator({
      moduleName: "esm-slaghoople",
      featureName: "The Slaghooples",
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" extensionSlotName="A slot" />);
    render(<App />);
    await waitFor(() => expect(screen.getByText("Pearl")).toBeInTheDocument());
    act(() => {
      temporaryConfigStore.setState({
        config: {
          "esm-slaghoople": {
            extensionSlots: {
              "A slot": {
                remove: ["Pearl"],
              },
            },
          },
        },
      });
    });
    expect(screen.queryByText("Pearl")).not.toBeInTheDocument();
  });

  test("Extension config should update with temporary config", async () => {
    registerSimpleExtension("Mr. Slate", "esm-flintstone", true);
    attach("A slot", "Mr. Slate");
    defineConfigSchema("esm-flintstone", { tie: { _default: "green" } });
    const App = openmrsComponentDecorator({
      moduleName: "esm-quarry",
      featureName: "The Flintstones",
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" extensionSlotName="A slot" />);
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Mr. Slate/)).toBeInTheDocument()
    );
    expect(screen.getByTestId("slot")).toHaveTextContent(/green/);
    act(() => {
      temporaryConfigStore.setState({
        config: {
          "esm-quarry": {
            extensionSlots: {
              "A slot": {
                configure: {
                  "Mr. Slate": { tie: "black" },
                },
              },
            },
          },
        },
      });
    });
    expect(screen.queryByText("green")).not.toBeInTheDocument();
    expect(screen.getByTestId("slot")).toHaveTextContent(/black/);
  });

  test("Extension config should override meta", async () => {
    registerSimpleExtension("Bamm-Bamm", "esm-flintstone", false, {
      clothes: "leopard",
    });
    attach("A slot", "Bamm-Bamm");
    defineConfigSchema("esm-flintstone", {});
    function RootComponent() {
      const store = useExtensionStore();
      return (
        <div id="metas">
          <div>A slot</div>
          {store.slots["A slot"].assignedExtensions.map((e) => (
            <div key={e.name}>{JSON.stringify(e.meta)}</div>
          ))}
        </div>
      );
    }
    const App = openmrsComponentDecorator({
      moduleName: "esm-flintstone",
      featureName: "The Flintstones",
      disableTranslations: true,
    })(RootComponent);
    render(<App />);
    await waitFor(() => expect(screen.getByText(/A slot/)).toBeInTheDocument());
    expect(screen.getByText(/clothes/)).toHaveTextContent(/leopard/);
    act(() => {
      temporaryConfigStore.setState({
        config: {
          "esm-flintstone": {
            extensionSlots: {
              "A slot": {
                configure: {
                  "Bamm-Bamm": { clothes: "tiger" },
                },
              },
            },
          },
        },
      });
    });
    expect(screen.getByText(/clothes/)).toHaveTextContent(/tiger/);
  });
});

function registerSimpleExtension(
  name: string,
  moduleName: string,
  takesConfig: boolean = false,
  meta: object = {}
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
  registerExtension({
    name,
    moduleName,
    load: getSyncLifecycle(
      takesConfig ? ConfigurableComponent : SimpleComponent,
      {
        moduleName,
        featureName: moduleName,
        disableTranslations: true,
      }
    ),
    meta,
  });
}
