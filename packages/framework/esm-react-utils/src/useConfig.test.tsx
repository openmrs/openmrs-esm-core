/* eslint-disable -- Test file uses React Testing Library patterns that conflict
   with current ESLint rules. TODO: Investigate updating test patterns or ESLint config */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  configInternalStore,
  defineConfigSchema,
  getConfigStore,
  getExtensionsConfigStore,
  provide,
  temporaryConfigStore,
  type ConfigInternalStore,
} from '@openmrs/esm-config';
import { type MockedStore } from '@openmrs/esm-state/mock';
import { useConfig } from './useConfig';
import { ComponentContext } from './ComponentContext';

vi.mock('@openmrs/esm-state', () => import('@openmrs/esm-state/mock'));

vi.mock('@openmrs/esm-config', async () => {
  const actual = await vi.importActual('@openmrs/esm-config');
  const mock = await import('@openmrs/esm-config/mock');

  return {
    ...actual,
    ...mock,
  };
});

const mockConfigInternalStore = configInternalStore as MockedStore<ConfigInternalStore>;

function RenderConfig(props) {
  const config = useConfig();

  return <button>{config[props.configKey]}</button>;
}

function RenderExternalConfig(props) {
  const config = useConfig({ externalModuleName: props.externalModuleName });

  return <button>{config[props.configKey]}</button>;
}

function clearConfig() {
  mockConfigInternalStore.resetMock();
}

describe.skip(`useConfig in root context`, () => {
  afterEach(clearConfig);

  it('can return config as a react hook', async () => {
    defineConfigSchema('foo-module', {
      thing: {
        _default: 'The first thing',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: 'foo-module', featureName: 'foo-feature' }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('The first thing')).toBeTruthy());
  });

  it('can handle multiple calls to useConfig from different modules', async () => {
    defineConfigSchema('foo-module', {
      thing: {
        _default: 'foo thing',
      },
    });

    defineConfigSchema('bar-module', {
      thing: {
        _default: 'bar thing',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: 'foo-module', featureName: 'foo-feature' }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('foo thing')).toBeTruthy());

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: 'bar-module', featureName: 'bar-feature' }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('bar thing')).toBeTruthy());
  });

  it('updates with a new value when the temporary config is updated', async () => {
    defineConfigSchema('foo-module', {
      thing: {
        _default: 'The first thing',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider value={{ moduleName: 'foo-module', featureName: 'foo-feature' }}>
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('The first thing')).toBeTruthy());

    act(() =>
      temporaryConfigStore.setState({
        config: { 'foo-module': { thing: 'A new thing' } },
      }),
    );

    await screen.findByText('A new thing');
  });
});

describe(`useConfig in an extension`, () => {
  afterEach(clearConfig);

  it('can return extension config as a react hook', async () => {
    defineConfigSchema('ext-module', {
      thing: {
        _default: 'The basics',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: 'ext-module',
            featureName: 'ext-feature',
            extension: {
              extensionSlotName: 'fooSlot',
              extensionSlotModuleName: 'slot-mod',
              extensionId: 'barExt#id1',
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('The basics')).toBeTruthy());
  });

  it('can handle multiple extensions', async () => {
    defineConfigSchema('first-module', {
      thing: {
        _default: 'first thing',
      },
    });

    defineConfigSchema('second-module', {
      thing: {
        _default: 'second thing',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: 'first-module',
            featureName: 'first-feature',
            extension: {
              extensionSlotName: 'fooSlot',
              extensionSlotModuleName: 'slot-mod',
              extensionId: 'fooExt#id1',
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
        <ComponentContext.Provider
          value={{
            moduleName: 'second-module',
            featureName: 'second-feature',
            extension: {
              extensionSlotName: 'fooSlot',
              extensionSlotModuleName: 'slot-mod',
              extensionId: 'barExt',
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('first thing')).toBeTruthy());
    await waitFor(() => expect(screen.findByText('second thing')).toBeTruthy());
  });

  it('can handle multiple extension slots', async () => {
    defineConfigSchema('extension-module', {
      thing: {
        _default: 'old extension thing',
      },
    });

    provide({
      'slot-2-module': {
        extensions: {
          slot2: {
            configure: {
              fooExt: { thing: 'a different thing' },
            },
          },
        },
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: 'extension-module',
            featureName: 'extension-feature',
            extension: {
              extensionSlotName: 'slot1',
              extensionSlotModuleName: 'slot-1-module',
              extensionId: 'fooExt',
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
        <ComponentContext.Provider
          value={{
            moduleName: 'extension-module',
            featureName: 'extension-feature',
            extension: {
              extensionSlotName: 'slot2',
              extensionSlotModuleName: 'slot-2-module',
              extensionId: 'fooExt',
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('old extension thing')).toBeTruthy());
    await waitFor(() => expect(screen.findByText('a different thing')).toBeTruthy());
  });

  it('updates with a new value when the temporary config is updated', async () => {
    defineConfigSchema('ext-module', {
      thing: {
        _default: 'The first thing',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: 'ext-module',
            featureName: 'ext-feature',
            extension: {
              extensionSlotName: 'fooSlot',
              extensionSlotModuleName: 'slot-module',
              extensionId: 'barExt#id1',
            },
          }}
        >
          <RenderConfig configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('The first thing')).toBeTruthy());

    const newConfig = { 'ext-module': { thing: 'A new thing' } };
    act(() => temporaryConfigStore.setState({ config: newConfig }));

    await waitFor(() => expect(screen.findByText('A new thing')).toBeTruthy());

    const newConfig2 = {
      'slot-module': {
        extensions: {
          fooSlot: {
            configure: {
              'barExt#id1': {
                thing: 'Yet another thing',
              },
            },
          },
        },
      },
    };
    act(() => temporaryConfigStore.setState({ config: newConfig2 }));

    await waitFor(() => expect(screen.findByText('Yet another thing')).toBeTruthy());
  });

  it("can optionally load an external module's configuration", async () => {
    defineConfigSchema('first-module', {
      thing: {
        _default: 'first thing',
      },
    });

    defineConfigSchema('second-module', {
      thing: {
        _default: 'second thing',
      },
    });

    render(
      <React.Suspense fallback={<div>Suspense!</div>}>
        <ComponentContext.Provider
          value={{
            moduleName: 'first-module',
            featureName: 'first-feature',
            extension: {
              extensionSlotName: 'fooSlot',
              extensionSlotModuleName: 'slot-mod',
              extensionId: 'fooExt#id1',
            },
          }}
        >
          <RenderExternalConfig externalModuleName="second-module" configKey="thing" />
        </ComponentContext.Provider>
      </React.Suspense>,
    );

    await waitFor(() => expect(screen.findByText('second thing')).toBeTruthy());
  });
});

/**
 * Helper: render a component that uses useConfig for a plain module (no extension).
 */
function renderModuleConfig(moduleName: string, configKey: string) {
  return render(
    <React.Suspense fallback={<div>Loading…</div>}>
      <ComponentContext.Provider value={{ moduleName, featureName: `${moduleName}-feature` }}>
        <RenderConfig configKey={configKey} />
      </ComponentContext.Provider>
    </React.Suspense>,
  );
}

/**
 * Helper: render a component that uses useConfig inside an extension context.
 */
function renderExtensionConfig(moduleName: string, slotName: string, extensionId: string, configKey: string) {
  return render(
    <React.Suspense fallback={<div>Loading…</div>}>
      <ComponentContext.Provider
        value={{
          moduleName,
          featureName: `${moduleName}-feature`,
          extension: {
            extensionSlotName: slotName,
            extensionSlotModuleName: 'slot-mod',
            extensionId,
          },
        }}
      >
        <RenderConfig configKey={configKey} />
      </ComponentContext.Provider>
    </React.Suspense>,
  );
}

describe('useConfig Suspense — module-config path', () => {
  afterEach(() => {
    mockConfigInternalStore.resetMock();
  });

  it('does not hang when config is already loaded before first render', async () => {
    // Seed the config store with a loaded state BEFORE the component renders.
    const store = getConfigStore('preloaded-module');
    act(() => {
      store.setState({ loaded: true, config: { answer: 42 }, translationOverridesLoaded: false });
    });

    renderModuleConfig('preloaded-module', 'answer');

    // The component must render the config value without indefinitely suspending.
    await screen.findByText('42');
  });

  it('resolves correctly when config loads after first render (baseline)', async () => {
    const store = getConfigStore('late-loading-module');

    renderModuleConfig('late-loading-module', 'greeting');

    // Initially the store is unloaded — the Suspense fallback is shown.
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    // simulate the config becoming available.
    act(() => {
      store.setState({ loaded: true, config: { greeting: 'hello' }, translationOverridesLoaded: false });
    });

    await screen.findByText('hello');
  });

  it('does not throw a stale settled promise on re-suspend after a store reset', async () => {
    const store = getConfigStore('reset-module');

    act(() => {
      store.setState({ loaded: true, config: { value: 'first' }, translationOverridesLoaded: false });
    });

    const { unmount } = renderModuleConfig('reset-module', 'value');
    await screen.findByText('first');

    unmount();

    // Simulate a store reset (e.g., config system recompute wipes the loaded state).
    act(() => {
      store.setState({ loaded: false, config: null, translationOverridesLoaded: false });
    });

    renderModuleConfig('reset-module', 'value');

    // The Suspense fallback must be visible while loading.
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    // Deliver the new config via a store update.
    act(() => {
      store.setState({ loaded: true, config: { value: 'second' }, translationOverridesLoaded: false });
    });

    await screen.findByText('second');
  });
});

describe('useConfig Suspense — extension-config path', () => {
  afterEach(() => {
    mockConfigInternalStore.resetMock();
  });

  it('does not hang when extension config is already loaded before first render', async () => {
    const moduleName = 'preloaded-ext-module';
    const extStore = getExtensionsConfigStore();
    const moduleStore = getConfigStore(moduleName);
    const slotName = 'preloaded-slot';
    const extensionId = 'preloaded-ext';

    // Both the module config AND extension config must be loaded up front.
    act(() => {
      moduleStore.setState({ loaded: true, config: {}, translationOverridesLoaded: false });
      extStore.setState({
        configs: {
          [slotName]: {
            [extensionId]: { loaded: true, config: { label: 'pre-loaded value' }, translationOverridesLoaded: false },
          },
        },
      });
    });

    renderExtensionConfig(moduleName, slotName, extensionId, 'label');

    await screen.findByText('pre-loaded value');
  });

  it('resolves correctly when extension config loads after first render (baseline)', async () => {
    const moduleName = 'late-ext-module';
    const extStore = getExtensionsConfigStore();
    const moduleStore = getConfigStore(moduleName);
    const slotName = 'late-slot';
    const extensionId = 'late-ext';

    // Module config must be pre-loaded so useNormalConfig doesn't block first.
    act(() => {
      moduleStore.setState({ loaded: true, config: {}, translationOverridesLoaded: false });
    });

    renderExtensionConfig(moduleName, slotName, extensionId, 'status');

    expect(screen.getByText('Loading…')).toBeInTheDocument();

    act(() => {
      extStore.setState({
        configs: {
          [slotName]: {
            [extensionId]: { loaded: true, config: { status: 'ready' }, translationOverridesLoaded: false },
          },
        },
      });
    });

    await screen.findByText('ready');
  });

  it('does not throw a stale settled promise on re-suspend after a store reset', async () => {
    const moduleName = 'reset-ext-module';
    const extStore = getExtensionsConfigStore();
    const moduleStore = getConfigStore(moduleName);
    const slotName = 'reset-slot';
    const extensionId = 'reset-ext';

    // Module config is always loaded so useNormalConfig doesn't block.
    act(() => {
      moduleStore.setState({ loaded: true, config: {}, translationOverridesLoaded: false });
    });

    // First render: extension config loads normally.
    act(() => {
      extStore.setState({
        configs: {
          [slotName]: {
            [extensionId]: { loaded: true, config: { data: 'original' }, translationOverridesLoaded: false },
          },
        },
      });
    });

    const { unmount } = renderExtensionConfig(moduleName, slotName, extensionId, 'data');
    await screen.findByText('original');

    unmount();

    // Wipe the extension config to simulate a recompute.
    act(() => {
      extStore.setState({ configs: {} });
    });

    // Re-mount with the same slot/extensionId key.
    renderExtensionConfig(moduleName, slotName, extensionId, 'data');

    expect(screen.getByText('Loading…')).toBeInTheDocument();

    act(() => {
      extStore.setState({
        configs: {
          [slotName]: {
            [extensionId]: { loaded: true, config: { data: 'refreshed' }, translationOverridesLoaded: false },
          },
        },
      });
    });

    await screen.findByText('refreshed');
  });
});
