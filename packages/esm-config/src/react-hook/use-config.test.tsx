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
        default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText("The first thing")).toBeTruthy();
    });
  });

  it(`can handle multiple calls to useConfig from different modules`, async () => {
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
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText("foo thing")).toBeTruthy();
    });

    cleanup();

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="bar-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText("bar thing")).toBeTruthy();
    });
  });

  it("updates with a new value when the temporary config is updated", async () => {
    defineConfigSchema("foo-module", {
      thing: {
        default: "The first thing",
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ModuleNameContext.Provider value="foo-module">
          <RenderConfig configKey="thing" />
        </ModuleNameContext.Provider>
      </React.Suspense>
    );

    await waitFor(() => {
      expect(screen.getByText("The first thing")).toBeTruthy();
    });

    setTemporaryConfigValue(["foo-module", "thing"], "A new thing");

    await waitFor(() => {
      expect(screen.getByText("A new thing")).toBeTruthy();
    });
  });
});

function RenderConfig(props) {
  const config = useConfig();

  return <button>{config[props.configKey]}</button>;
}
