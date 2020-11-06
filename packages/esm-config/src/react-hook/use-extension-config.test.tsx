import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { ModuleNameContext, ExtensionContext } from "@openmrs/esm-context";
import {
  clearAll,
  defineConfigSchema,
  provide,
  setTemporaryConfigValue,
} from "../module-config/module-config";
import { useExtensionConfig } from "./use-extension-config";
import { clearConfigCache } from "./config-cache";

describe(`useExtensionConfig`, () => {
  afterEach(clearAll);
  afterEach(cleanup);
  afterEach(clearConfigCache);

  it(`can return extension config as a react hook`, async () => {
    defineConfigSchema("ext-module", {
      thing: {
        default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="slot-module">
          <ExtensionContext.Provider
            value={{
              extensionModuleName: "ext-module",
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionId: "barExt#id1",
            }}
          >
            <RenderConfig configKey="thing" />
          </ExtensionContext.Provider>
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(screen.findByText("The first thing")).toBeTruthy();
  });

  it(`can handle multiple extensions`, async () => {
    defineConfigSchema("foo-module", {
      thing: {
        default: "foo thing",
      },
    });

    defineConfigSchema("bar-module", {
      thing: {
        default: "bar thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="slot-module">
          <ExtensionContext.Provider
            value={{
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionModuleName: "foo-module",
              extensionId: "fooExt#id1",
            }}
          >
            <RenderConfig configKey="thing" />
          </ExtensionContext.Provider>
          <ExtensionContext.Provider
            value={{
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionModuleName: "bar-module",
              extensionId: "barExt",
            }}
          >
            <RenderConfig configKey="thing" />
          </ExtensionContext.Provider>
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(await screen.findByText("foo thing")).toBeTruthy();
    expect(screen.findByText("bar thing")).toBeTruthy();
  });

  it("can handle multiple extension slots", async () => {
    defineConfigSchema("foo-module", {
      thing: {
        default: "foo thing",
      },
    });

    provide({
      "slot-2-module": {
        extensions: {
          slot2: {
            configure: {
              fooExt: { thing: "another thing" },
            },
          },
        },
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="slot-1-module">
          <ExtensionContext.Provider
            value={{
              actualExtensionSlotName: "slot1",
              attachedExtensionSlotName: "slot1",
              extensionModuleName: "foo-module",
              extensionId: "fooExt",
            }}
          >
            <RenderConfig configKey="thing" />
          </ExtensionContext.Provider>
        </ModuleNameContext.Provider>
        <ModuleNameContext.Provider value="slot-2-module">
          <ExtensionContext.Provider
            value={{
              actualExtensionSlotName: "slot2",
              attachedExtensionSlotName: "slot2",
              extensionModuleName: "foo-module",
              extensionId: "fooExt",
            }}
          >
            <RenderConfig configKey="thing" />
          </ExtensionContext.Provider>
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(await screen.findByText("foo thing")).toBeTruthy();
    expect(screen.findByText("another thing")).toBeTruthy();
  });

  it("updates with a new value when the temporary config is updated", async () => {
    defineConfigSchema("ext-module", {
      thing: {
        default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="slot-module">
          <ExtensionContext.Provider
            value={{
              actualExtensionSlotName: "fooSlot",
              attachedExtensionSlotName: "fooSlot",
              extensionModuleName: "ext-module",
              extensionId: "barExt#id1",
            }}
          >
            <RenderConfig configKey="thing" />
          </ExtensionContext.Provider>
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(await screen.findByText("The first thing")).toBeTruthy();

    setTemporaryConfigValue(["ext-module", "thing"], "A new thing");

    expect(await screen.findByText("A new thing")).toBeTruthy();

    setTemporaryConfigValue(
      [
        "slot-module",
        "extensions",
        "fooSlot",
        "configure",
        "barExt#id1",
        "thing",
      ],
      "Yet another thing"
    );

    expect(await screen.findByText("Yet another thing")).toBeTruthy();
  });
});

function RenderConfig(props) {
  const config = useExtensionConfig();

  return <button>{config[props.configKey]}</button>;
}
