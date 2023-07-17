import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Person } from "@openmrs/esm-api";
import { mockSessionStore } from "../../mock";
import {
  attach,
  registerExtension,
  updateInternalExtensionStore,
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

jest.mock("@openmrs/esm-api", () => {
  const original = jest.requireActual("@openmrs/esm-api");
  return {
    ...original,
    getSessionStore: () => mockSessionStore,
    refetchCurrentUser: jest.fn(),
  };
});

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

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-flintstone",
        featureName: "The Flintstones",
        disableTranslations: true,
      })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

      render(<App />);
    });

    await waitFor(() => expect(screen.getByText("Betty")).toBeInTheDocument());

    const slot = screen.getByTestId("slot");
    const extensions = slot.childNodes;

    await waitFor(() => {
      expect(extensions[0]).toHaveTextContent("Betty");
      expect(extensions[1]).toHaveTextContent("Wilma");
      expect(extensions[2]).toHaveTextContent("Barney");
      expect(screen.queryByText("Fred")).not.toBeInTheDocument();
    });
  });

  test("Extensions should recieve config from module and from 'configure' key", async () => {
    registerSimpleExtension("Pebbles", "esm-flintstone", true);
    defineConfigSchema("esm-flintstone", {
      town: { _type: Type.String, _default: "Bedrock" },
    });
    attach("Flintstone slot", "Pebbles");
    attach("Future slot", "Pebbles");
    provide({
      "esm-flintstone": {
        town: "Springfield",
        extensionSlots: {
          "Future slot": {
            configure: {
              Pebbles: {
                town: "New New York",
              },
            },
          },
        },
      },
    });

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-flintstone",
        featureName: "The Flintstones",
        disableTranslations: true,
      })(() => (
        <>
          <ExtensionSlot data-testid="flintstone-slot" name="Flintstone slot" />
          <ExtensionSlot data-testid="future-slot" name="Future slot" />
        </>
      ));

      render(<App />);
    });

    await screen.findAllByText(/.*Pebbles.*/);

    const flintstonePebbles = screen.getByTestId("flintstone-slot");
    const futurePebbles = screen.getByTestId("future-slot");

    await waitFor(() => {
      expect(flintstonePebbles).toHaveTextContent(/Pebbles:.*Springfield/);
      expect(futurePebbles).toHaveTextContent(/Pebbles:.*New New York/);
    });
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

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-flintstone",
        featureName: "The Flintstones",
        disableTranslations: true,
      })(() => (
        <>
          <ExtensionSlot data-testid="flintstone-slot" name="Flintstone slot" />
        </>
      ));

      render(<App />);
    });

    await screen.findAllByText(/.*Dino.*/);

    const slot = screen.getByTestId("flintstone-slot");

    await waitFor(() => {
      expect(slot.firstChild).toHaveTextContent(/Dino/);
      expect(slot.lastChild).toHaveTextContent(/Baby Puss/);
    });
  });

  test("Slot config should update with temporary config", async () => {
    registerSimpleExtension("Pearl", "esm-slaghoople");
    attach("A slot", "Pearl");
    defineConfigSchema("esm-slaghoople", {});

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-slaghoople",
        featureName: "The Slaghooples",
        disableTranslations: true,
      })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

      render(<App />);
    });

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

    await waitFor(() =>
      expect(screen.queryByText("Pearl")).not.toBeInTheDocument()
    );
  });

  test("Extension config should update with temporary config", async () => {
    registerSimpleExtension("Mr. Slate", "esm-flintstone", true);
    attach("A slot", "Mr. Slate");
    defineConfigSchema("esm-flintstone", { tie: { _default: "green" } });

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-quarry",
        featureName: "The Flintstones",
        disableTranslations: true,
      })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

      render(<App />);
    });

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

    await waitFor(() => {
      expect(screen.getByTestId("slot")).toHaveTextContent(/black/);
      expect(screen.queryByText("green")).not.toBeInTheDocument();
    });
  });

  test("Extension config should be available in extension store", async () => {
    registerSimpleExtension("Bamm-Bamm", "esm-flintstone", false);
    attach("A slot", "Bamm-Bamm");
    defineConfigSchema("esm-flintstone", { clothes: { _default: "leopard" } });
    function RootComponent() {
      const store = useExtensionStore();
      return (
        <div>
          <ExtensionSlot data-testid="slot" name="A slot" />
          {store.slots["A slot"].assignedExtensions.map((e) => (
            <div key={e.name}>{JSON.stringify(e.config)}</div>
          ))}
        </div>
      );
    }

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-flintstone",
        featureName: "The Flintstones",
        disableTranslations: true,
      })(RootComponent);

      render(<App />);
    });

    await waitFor(() => expect(screen.getByTestId(/slot/)).toBeInTheDocument());

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

  test("should not show extension when user lacks configured privilege", async () => {
    mockSessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: "1",
        user: {
          uuid: "1",
          display: "Non-Admin",
          username: "nonadmin",
          systemId: "nonadmin",
          userProperties: {},
          person: {} as Person,
          privileges: [],
          roles: [],
          retired: false,
          locale: "en",
          allowedLocales: ["en"],
        },
      },
    });

    registerSimpleExtension("Schmoo", "esm-bedrock", true);
    registerSimpleExtension("Wilma", "esm-flintstones", true);
    attach("A slot", "Schmoo");
    attach("A slot", "Wilma");
    defineConfigSchema("esm-bedrock", {});
    defineConfigSchema("esm-flintstones", {});
    provide({
      "esm-bedrock": {
        "Display conditions": {
          privileges: ["Yabadabadoo!"],
        },
      },
    });
    provide({
      "esm-flintstones": {},
    });

    function RootComponent() {
      return (
        <div>
          <ExtensionSlot data-testid="slot" name="A slot" />
        </div>
      );
    }

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-bedrock",
        featureName: "Bedrock",
        disableTranslations: true,
      })(RootComponent);

      render(<App />);
    });

    await waitFor(() => expect(screen.getByTestId(/slot/)).toBeInTheDocument());
    expect(screen.getByTestId("slot").firstChild).toHaveAttribute(
      "data-extension-id",
      "Wilma"
    );
    expect(screen.queryAllByText(/\bSchmoo\b/)).toHaveLength(0);
  });

  test("should show extension when user has configured privilege", async () => {
    mockSessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: "1",
        user: {
          uuid: "1",
          display: "Non-Admin",
          username: "nonadmin",
          systemId: "nonadmin",
          userProperties: {},
          person: {} as Person,
          privileges: [{ uuid: "1", display: "Yabadabadoo!" }],
          roles: [],
          retired: false,
          locale: "en",
          allowedLocales: ["en"],
        },
      },
    });

    registerSimpleExtension("Schmoo", "esm-bedrock", true);
    attach("A slot", "Schmoo");
    defineConfigSchema("esm-bedrock", {});
    provide({
      "esm-bedrock": {
        "Display conditions": {
          privileges: ["Yabadabadoo!"],
        },
      },
    });

    function RootComponent() {
      return (
        <div>
          <ExtensionSlot data-testid="slot" name="A slot" />
        </div>
      );
    }

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-bedrock",
        featureName: "Bedrock",
        disableTranslations: true,
      })(RootComponent);

      render(<App />);
    });

    await waitFor(() => expect(screen.getByTestId(/slot/)).toBeInTheDocument());
    expect(screen.getByTestId("slot").firstChild).toHaveAttribute(
      "data-extension-id",
      "Schmoo"
    );
  });

  test("should only show extensions users have default privilege for", async () => {
    mockSessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: "1",
        user: {
          uuid: "1",
          display: "Non-Admin",
          username: "nonadmin",
          systemId: "nonadmin",
          userProperties: {},
          person: {} as Person,
          privileges: [{ uuid: "1", display: "YOWTCH!" }],
          roles: [],
          retired: false,
          locale: "en",
          allowedLocales: ["en"],
        },
      },
    });

    registerSimpleExtension("Schmoo", "esm-bedrock", true, "Yabadabadoo!");
    registerSimpleExtension("Wilma", "esm-flintstones", true, "YOWTCH!");
    attach("A slot", "Schmoo");
    attach("A slot", "Wilma");
    defineConfigSchema("esm-bedrock", {});
    defineConfigSchema("esm-flintstones", {});
    provide({ "esm-bedrock": {} });
    provide({ "esm-flintstones": {} });

    function RootComponent() {
      return (
        <div>
          <ExtensionSlot data-testid="slot" name="A slot" />
        </div>
      );
    }

    act(() => {
      const App = openmrsComponentDecorator({
        moduleName: "esm-bedrock",
        featureName: "Bedrock",
        disableTranslations: true,
      })(RootComponent);

      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByTestId(/slot/)).toBeInTheDocument();
      expect(screen.getByTestId("slot").firstChild).toHaveAttribute(
        "data-extension-id",
        "Wilma"
      );
      expect(screen.queryAllByText(/\bSchmoo\b/)).toHaveLength(0);
    });
  });
});

function registerSimpleExtension(
  name: string,
  moduleName: string,
  takesConfig: boolean = false,
  privileges?: string | string[]
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
    meta: {},
    privileges,
  });
}
