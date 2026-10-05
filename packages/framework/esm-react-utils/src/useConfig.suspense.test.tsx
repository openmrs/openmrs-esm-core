import React, { Suspense } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import {
  configExtensionStore,
  configInternalStore,
  defineConfigSchema,
  getConfigStore,
  getExtensionsConfigStore,
} from '@openmrs/esm-config';
import { ComponentContext } from './ComponentContext';
import { useConfig } from './useConfig';

const slotName = 'test-slot';
const slotModuleName = 'slot-module';
const extensionId = 'thing#instance';
const extensionModuleName = 'ext-module';

/** How many times `ShowConfig` has started rendering, including attempts that suspended. */
let renders = 0;

function ShowConfig() {
  renders++;
  const config = useConfig<{ thing: string }>();
  return <div>{config.thing}</div>;
}

function renderExtension() {
  return render(
    <Suspense fallback={<div>suspended</div>}>
      <ComponentContext.Provider
        value={{
          moduleName: extensionModuleName,
          featureName: 'ext-feature',
          extension: { extensionSlotName: slotName, extensionSlotModuleName: slotModuleName, extensionId },
        }}
      >
        <ShowConfig />
      </ComponentContext.Provider>
    </Suspense>,
  );
}

/**
 * Lets a suspended component sit for a while and returns how many times it tried to render meanwhile.
 * Re-throwing a promise that has already settled makes React retry at once, over and over, rather
 * than wait, which is how a stale cached promise shows up.
 */
async function rendersWhileWaiting() {
  renders = 0;
  await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
  return renders;
}

function renderModule(moduleName: string) {
  return render(
    <Suspense fallback={<div>suspended</div>}>
      <ComponentContext.Provider value={{ moduleName, featureName: 'f' }}>
        <ShowConfig />
      </ComponentContext.Provider>
    </Suspense>,
  );
}

/**
 * Counts the subscriptions on `store` made from now on that are still live, so a leak shows up as a
 * non-zero count. The config system's own subscriptions, made before this is called, are not counted.
 */
function countSubscriptions(store: { subscribe: (listener: any) => () => void }) {
  const realSubscribe = store.subscribe.bind(store);
  const counter = { live: 0 };

  store.subscribe = (listener) => {
    counter.live++;
    const unsubscribe = realSubscribe(listener);

    return () => {
      counter.live--;
      unsubscribe();
    };
  };

  return counter;
}

/** Registers the extension as mounted, which is what drives the config system to derive its config. */
function mountExtension() {
  act(() => {
    configExtensionStore.setState({
      mountedExtensions: [{ slotName, slotModuleName, extensionId, extensionModuleName }],
    });
  });
}

/** Unregisters it, which drops its entry from the extensions config store. */
function unmountExtension() {
  act(() => {
    configExtensionStore.setState({ mountedExtensions: [] });
  });
}

afterEach(() => {
  configExtensionStore.setState({ mountedExtensions: [] });
  configInternalStore.setState({ ...configInternalStore.getState(), providedConfigs: [] });
});

describe('useConfig suspense', () => {
  it('renders an extension whose config arrives after the first render', async () => {
    defineConfigSchema(extensionModuleName, { thing: { _default: 'the thing' } });

    renderExtension();
    expect(screen.getByText('suspended')).toBeInTheDocument();

    mountExtension();

    expect(await screen.findByText('the thing')).toBeInTheDocument();
  });

  it('renders an extension that mounts, unmounts and mounts again', async () => {
    defineConfigSchema(extensionModuleName, { thing: { _default: 'the thing' } });

    // First cycle: suspends, config arrives, renders.
    const view = renderExtension();
    mountExtension();
    expect(await screen.findByText('the thing')).toBeInTheDocument();

    // The extension goes away, taking its config store entry with it.
    view.unmount();
    unmountExtension();

    // Second cycle: the same extension in the same slot waits under the same cache id as the first.
    renderExtension();
    expect(screen.getByText('suspended')).toBeInTheDocument();
    expect(await rendersWhileWaiting()).toBeLessThanOrEqual(2);

    mountExtension();

    expect(await screen.findByText('the thing')).toBeInTheDocument();
  });

  it('renders a module whose config store loads while it is suspended', async () => {
    const moduleName = 'preloaded-module';
    defineConfigSchema(moduleName, { thing: { _default: 'preloaded thing' } });

    const store = getConfigStore(moduleName);
    const loaded = store.getState();

    act(() => store.setState({ ...loaded, loaded: false, config: null }));

    renderModule(moduleName);
    expect(screen.getByText('suspended')).toBeInTheDocument();

    act(() => store.setState(loaded));

    expect(await screen.findByText('preloaded thing')).toBeInTheDocument();
  });

  it('renders a module whose config has already loaded without suspending', () => {
    defineConfigSchema('loaded-module', { thing: { _default: 'already there' } });

    renderModule('loaded-module');

    expect(screen.getByText('already there')).toBeInTheDocument();
  });

  it('renders an extension whose config has already loaded without suspending', () => {
    defineConfigSchema(extensionModuleName, { thing: { _default: 'the thing' } });
    mountExtension();

    renderExtension();

    expect(screen.getByText('the thing')).toBeInTheDocument();
  });

  it('renders a module that suspends again after an earlier wait for it settled', async () => {
    const moduleName = 'reloaded-module';
    defineConfigSchema(moduleName, { thing: { _default: 'first' } });

    const store = getConfigStore(moduleName);
    const first = store.getState();

    act(() => store.setState({ ...first, loaded: false, config: null }));
    const view = renderModule(moduleName);
    act(() => store.setState(first));
    expect(await screen.findByText('first')).toBeInTheDocument();
    view.unmount();

    act(() => store.setState({ ...first, loaded: false, config: null }));
    renderModule(moduleName);
    expect(screen.getByText('suspended')).toBeInTheDocument();
    expect(await rendersWhileWaiting()).toBeLessThanOrEqual(2);

    act(() => store.setState({ ...first, config: { ...first.config, thing: 'second' } }));

    expect(await screen.findByText('second')).toBeInTheDocument();
  });

  it('leaves no subscription on a module store once its wait settles and the component unmounts', async () => {
    const moduleName = 'counted-module';
    defineConfigSchema(moduleName, { thing: { _default: 'counted' } });

    const store = getConfigStore(moduleName);
    const loaded = store.getState();
    act(() => store.setState({ ...loaded, loaded: false, config: null }));
    const subscriptions = countSubscriptions(store);

    const view = renderModule(moduleName);
    act(() => store.setState(loaded));
    expect(await screen.findByText('counted')).toBeInTheDocument();
    view.unmount();

    expect(subscriptions.live).toBe(0);
  });

  it('leaves no subscription on the extensions store once its wait settles and the component unmounts', async () => {
    defineConfigSchema(extensionModuleName, { thing: { _default: 'the thing' } });
    const subscriptions = countSubscriptions(getExtensionsConfigStore());

    const view = renderExtension();
    mountExtension();
    expect(await screen.findByText('the thing')).toBeInTheDocument();
    view.unmount();

    expect(subscriptions.live).toBe(0);
  });
});
