import React, { useCallback, useReducer } from "react";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import {
  attach,
  ConnectedExtension,
  getExtensionNameFromId,
  registerExtension,
  updateInternalExtensionStore,
} from "@openmrs/esm-extensions";
import {
  getSyncLifecycle,
  Extension,
  ExtensionSlot,
  openmrsComponentDecorator,
  useExtensionSlotMeta,
  ExtensionData,
} from ".";
import userEvent from "@testing-library/user-event";
import {
  registerFeatureFlag,
  setFeatureFlag,
} from "@openmrs/esm-feature-flags";

// For some reason in the text context `isEqual` always returns true
// when using the import substitution in jest.config.js. Here's a custom
// mock.
jest.mock(
  "lodash-es/isEqual",
  () => (a, b) => JSON.stringify(a) == JSON.stringify(b)
);

describe("ExtensionSlot, Extension, and useExtensionSlotMeta", () => {
  beforeEach(() => {
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
  });

  test("Extension receives state changes passed through (not using <Extension>)", async () => {
    function EnglishExtension({ suffix }) {
      return <div>English{suffix}</div>;
    }
    registerSimpleExtension("English", "esm-languages-app", EnglishExtension);
    attach("Box", "English");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer(
        (suffix) => (suffix == "!" ? "?" : "!"),
        "!"
      );
      return (
        <div>
          <ExtensionSlot name="Box" state={{ suffix }} />
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/English/)).toBeInTheDocument()
    );
    expect(screen.getByText(/English/)).toHaveTextContent("English!");
    userEvent.click(screen.getByText("Toggle suffix"));
    await waitFor(() =>
      expect(screen.getByText(/English/)).toHaveTextContent("English?")
    );
  });

  test("Extension receives state changes (using <Extension>)", async () => {
    function HaitianCreoleExtension({ suffix }) {
      return <div>Haitian Creole{suffix}</div>;
    }
    registerSimpleExtension(
      "Haitian",
      "esm-languages-app",
      HaitianCreoleExtension
    );
    attach("Box", "Haitian");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer(
        (suffix) => (suffix == "!" ? "?" : "!"),
        "!"
      );

      return (
        <div>
          <ExtensionSlot name="Box">
            {suffix}
            <Extension state={{ suffix }} />
          </ExtensionSlot>
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Haitian/)).toBeInTheDocument()
    );
    expect(screen.getByText(/Haitian/)).toHaveTextContent("Haitian Creole!");
    userEvent.click(screen.getByText("Toggle suffix"));
    await waitFor(() =>
      expect(screen.getByText(/Haitian/)).toHaveTextContent("Haitian Creole?")
    );
  });

  test("ExtensionSlot throws error if both state and children provided", () => {
    const App = () => (
      <ExtensionSlot name="Box" state={{ color: "red" }}>
        <Extension />
      </ExtensionSlot>
    );
    expect(() => render(<App />)).toThrowError(
      expect.objectContaining({
        message: expect.stringMatching(/children.*state/),
      })
    );
  });

  test("Extension Slot receives meta", async () => {
    registerSimpleExtension("Spanish", "esm-languages-app", undefined, {
      code: "es",
    });
    attach("Box", "Spanish");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const metas = useExtensionSlotMeta("Box");
      const wrapItem = useCallback(
        (slot: React.ReactNode, extension: ExtensionData) => {
          return (
            <div>
              <h1>
                {metas[getExtensionNameFromId(extension.extensionId)].code}
              </h1>
              {slot}
            </div>
          );
        },
        [metas]
      );
      return (
        <div>
          <ExtensionSlot name="Box">
            <Extension wrap={wrapItem} />
          </ExtensionSlot>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByRole("heading")).toBeInTheDocument()
    );
    expect(screen.getByRole("heading")).toHaveTextContent("es");
    await waitFor(() =>
      expect(screen.getByText("Spanish")).toBeInTheDocument()
    );
  });

  test("Both meta and state can be used at the same time", async () => {
    function SwahiliExtension({ suffix }) {
      return <div>Swahili{suffix}</div>;
    }
    registerSimpleExtension("Swahili", "esm-languages-app", SwahiliExtension, {
      code: "sw",
    });
    attach("Box", "Swahili");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer(
        (suffix) => (suffix == "!" ? "?" : "!"),
        "!"
      );
      const metas = useExtensionSlotMeta("Box");
      const wrapItem = useCallback(
        (slot: React.ReactNode, extension?: ExtensionData) => {
          return (
            <div>
              <h1>
                {
                  metas[getExtensionNameFromId(extension?.extensionId ?? "")]
                    .code
                }
              </h1>
              {slot}
            </div>
          );
        },
        [metas]
      );
      return (
        <div>
          <ExtensionSlot name="Box">
            <Extension state={{ suffix }}>{wrapItem}</Extension>
          </ExtensionSlot>
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });
    render(<App />);

    await waitFor(() =>
      expect(screen.getByRole("heading")).toBeInTheDocument()
    );
    expect(screen.getByRole("heading")).toHaveTextContent("sw");
    await waitFor(() =>
      expect(screen.getByText(/Swahili/)).toHaveTextContent("Swahili!")
    );
    userEvent.click(screen.getByText("Toggle suffix"));
    await waitFor(() =>
      expect(screen.getByText(/Swahili/)).toHaveTextContent("Swahili?")
    );
  });

  test("Extension Slot renders function children", async () => {
    registerSimpleExtension("Urdu", "esm-languages-app", undefined, {
      code: "urd",
    });
    registerSimpleExtension("Hindi", "esm-languages-app", undefined, {
      code: "hi",
    });
    attach("Box", "Urdu");
    attach("Box", "Hindi");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      return (
        <div>
          <ExtensionSlot name="Box">
            {(extension: ConnectedExtension) => (
              <div data-testid={extension.name}>
                <h2>{extension.meta.code}</h2>
                <Extension />
              </div>
            )}
          </ExtensionSlot>
        </div>
      );
    });
    render(<App />);

    await waitFor(() => expect(screen.getByTestId("Urdu")).toBeInTheDocument());
    expect(
      within(screen.getByTestId("Urdu")).getByRole("heading")
    ).toHaveTextContent("urd");
    expect(
      within(screen.getByTestId("Hindi")).getByRole("heading")
    ).toHaveTextContent("hi");
  });

  test("Extension renders with child function", async () => {
    registerSimpleExtension("Hindi", "esm-languages-app", undefined, {
      code: "hi",
    });
    attach("Box", "Hindi");
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => {
      return (
        <div>
          <ExtensionSlot name="Box">
            {() => (
              <Extension>
                {(slot) => <div data-testid="custom-wrapper">{slot}</div>}
              </Extension>
            )}
          </ExtensionSlot>
        </div>
      );
    });

    render(<App />);

    await waitFor(() =>
      expect(screen.getByTestId("custom-wrapper")).toBeInTheDocument()
    );

    // essentially: is the first child of custom-wrapper the extension?
    expect(screen.getByTestId("custom-wrapper").children[0]).toHaveAttribute(
      "data-extension-id",
      "Hindi"
    );
  });

  test("Extensions behind feature flags only render when their feature flag is enabled", async () => {
    registerSimpleExtension("Arabic", "esm-languages-app");
    registerSimpleExtension(
      "Turkish",
      "esm-languages-app",
      undefined,
      undefined,
      "turkic"
    );
    registerSimpleExtension(
      "Turkmeni",
      "esm-languages-app",
      undefined,
      undefined,
      "turkic"
    );
    registerSimpleExtension(
      "Kurmanji",
      "esm-languages-app",
      undefined,
      undefined,
      "kurdish"
    );
    attach("Box", "Arabic");
    attach("Box", "Turkish");
    attach("Box", "Turkmeni");
    attach("Box", "Kurmanji");
    registerFeatureFlag("turkic", "", "");
    registerFeatureFlag("kurdish", "", "");
    setFeatureFlag("turkic", true);
    const App = openmrsComponentDecorator({
      moduleName: "esm-languages-app",
      featureName: "Languages",
      disableTranslations: true,
    })(() => <ExtensionSlot name="Box" />);
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText(/Turkmeni/)).toBeInTheDocument()
    );
    expect(screen.getByText("Arabic")).toBeInTheDocument();
    expect(screen.getByText("Turkish")).toBeInTheDocument();
    expect(screen.queryByText("Kurmanji")).not.toBeInTheDocument();
    act(() => setFeatureFlag("kurdish", true));
    await waitFor(() =>
      expect(screen.getByText("Kurmanji")).toBeInTheDocument()
    );
  });
});

function registerSimpleExtension(
  name: string,
  moduleName: string,
  Component?: React.ComponentType<any>,
  meta: object = {},
  featureFlag?: string
) {
  const SimpleComponent = () => <div>{name}</div>;
  registerExtension({
    name,
    moduleName,
    load: getSyncLifecycle(Component ?? SimpleComponent, {
      moduleName,
      featureName: moduleName,
      disableTranslations: true,
    }),
    meta,
    featureFlag,
  });
}
