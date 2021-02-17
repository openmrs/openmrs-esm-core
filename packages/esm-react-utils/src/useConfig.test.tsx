import React from "react";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import {
  reloadImportMapConfig,
  defineConfigSchema,
  temporaryConfigStore,
  provide,
  configInternalStore,
  ConfigInternalStore,
} from "@openmrs/esm-config";
import { MockedStore } from "../__mocks__/openmrs-esm-state.mock";
import { useConfig } from "./useConfig";
import { ComponentContext } from "./ComponentContext";

const mockConfigInternalStore = configInternalStore as MockedStore<
  ConfigInternalStore
>;

function RenderConfig(props) {
  const config = useConfig();

  return <button>{config[props.configKey]}</button>;
}

function clearConfig() {
  mockConfigInternalStore.resetMock();
  reloadImportMapConfig();
}

describe(`useConfig in root context`, () => {
  afterEach(clearConfig);
  afterEach(cleanup);

  it(`can return config as a react hook`, async () => {
    defineConfigSchema("foo-module", {
      thing: {
        _default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: "foo-module" }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() =>
      expect(screen.findByText("The first thing")).toBeTruthy()
    );
  });

  it(`can handle multiple calls to useConfig from different modules`, async () => {
    defineConfigSchema("foo-module", {
      thing: {
        _default: "foo thing",
      },
    });

    defineConfigSchema("bar-module", {
      thing: {
        _default: "bar thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: "foo-module" }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => expect(screen.findByText("foo thing")).toBeTruthy());

    await cleanup();

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: "bar-module" }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => expect(screen.findByText("bar thing")).toBeTruthy());
  });

  it("updates with a new value when the temporary config is updated", async () => {
    defineConfigSchema("foo-module", {
      thing: {
        _default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: "foo-module" }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() =>
      expect(screen.findByText("The first thing")).toBeTruthy()
    );

    temporaryConfigStore.setState({
      config: { "foo-module": { thing: "A new thing" } },
    });

    await waitFor(() => expect(screen.findByText("A new thing")).toBeTruthy());
  });
});

describe(`useConfig in an extension`, () => {
  afterEach(clearConfig);
  afterEach(cleanup);

  it(`can return extension config as a react hook`, async () => {
    defineConfigSchema("ext-module", {
      thing: {
        _default: "The basics",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: "",
            extension: {
              extensionModuleName: "ext-module",
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionSlotModuleName: "slot-mod",
              extensionId: "barExt#id1",
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => expect(screen.findByText("The basics")).toBeTruthy());
  });

  it(`can handle multiple extensions`, async () => {
    defineConfigSchema("first-module", {
      thing: {
        _default: "first thing",
      },
    });

    defineConfigSchema("second-module", {
      thing: {
        _default: "second thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: "",
            extension: {
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionSlotModuleName: "slot-mod",
              extensionModuleName: "first-module",
              extensionId: "fooExt#id1",
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
        <ComponentContext.Provider
          value={{
            moduleName: "",
            extension: {
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionSlotModuleName: "slot-mod",
              extensionModuleName: "second-module",
              extensionId: "barExt",
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => expect(screen.findByText("first thing")).toBeTruthy());
    await waitFor(() => expect(screen.findByText("second thing")).toBeTruthy());
  });

  it("can handle multiple extension slots", async () => {
    defineConfigSchema("extension-module", {
      thing: {
        _default: "old extension thing",
      },
    });

    provide({
      "slot-2-module": {
        extensions: {
          slot2: {
            configure: {
              fooExt: { thing: "a different thing" },
            },
          },
        },
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: "",
            extension: {
              actualExtensionSlotName: "slot1",
              attachedExtensionSlotName: "slot1",
              extensionSlotModuleName: "slot-1-module",
              extensionModuleName: "extension-module",
              extensionId: "fooExt",
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
        <ComponentContext.Provider
          value={{
            moduleName: "",
            extension: {
              actualExtensionSlotName: "slot2",
              attachedExtensionSlotName: "slot2",
              extensionSlotModuleName: "slot-2-module",
              extensionModuleName: "extension-module",
              extensionId: "fooExt",
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() =>
      expect(screen.findByText("old extension thing")).toBeTruthy()
    );
    await waitFor(() =>
      expect(screen.findByText("a different thing")).toBeTruthy()
    );
  });

  it("updates with a new value when the temporary config is updated", async () => {
    defineConfigSchema("ext-module", {
      thing: {
        _default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: "",
            extension: {
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionSlotModuleName: "slot-module",
              extensionModuleName: "ext-module",
              extensionId: "barExt#id1",
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>
    );

    await waitFor(() =>
      expect(screen.findByText("The first thing")).toBeTruthy()
    );

    const newConfig = { "ext-module": { thing: "A new thing" } };
    temporaryConfigStore.setState({ config: newConfig });

    await waitFor(() => expect(screen.findByText("A new thing")).toBeTruthy());

    const newConfig2 = {
      "slot-module": {
        extensions: {
          fooSlot: {
            configure: {
              "barExt#id1": {
                thing: "Yet another thing",
              },
            },
          },
        },
      },
    };
    temporaryConfigStore.setState({ config: newConfig2 });

    await waitFor(() =>
      expect(screen.findByText("Yet another thing")).toBeTruthy()
    );
  });
});
