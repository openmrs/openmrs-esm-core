/* eslint-disable -- Test file uses React Testing Library patterns that conflict
   with current ESLint rules. TODO: Investigate updating test patterns or ESLint config */
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  configInternalStore,
  defineConfigSchema,
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
