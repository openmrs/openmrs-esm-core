import React from "react";
import { ModuleNameContext } from "@openmrs/esm-context";
import { render, cleanup, screen, waitFor } from "@testing-library/react";
import { useConfig } from "./use-config";
import {
  clearAll,
  defineConfigSchema,
  setTemporaryConfigValue,
} from "../module-config/module-config";
import { clearConfigCache } from "./config-cache";

describe(`useConfig`, () => {
  afterEach(clearAll);
  afterEach(cleanup);
  afterEach(clearConfigCache);

  it(`can return config as a react hook`, async () => {
    defineConfigSchema("foo-module", {
      thing: {
        _default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(screen.findByText("The first thing")).toBeTruthy();
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
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(screen.findByText("foo thing")).toBeTruthy();

    cleanup();

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="bar-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(screen.findByText("bar thing")).toBeTruthy();
  });

  it("updates with a new value when the temporary config is updated", async () => {
    defineConfigSchema("foo-module", {
      thing: {
        _default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    expect(screen.findByText("The first thing")).toBeTruthy();

    setTemporaryConfigValue(["foo-module", "thing"], "A new thing");

    expect(screen.findByText("A new thing")).toBeTruthy();
  });
});

function RenderConfig(props) {
  const config = useConfig();

  return <button>{config[props.configKey]}</button>;
}
