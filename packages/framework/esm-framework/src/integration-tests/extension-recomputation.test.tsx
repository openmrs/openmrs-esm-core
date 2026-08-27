/* eslint-disable testing-library/no-unnecessary-act, testing-library/no-manual-cleanup */
// Rendering is wrapped in `act` because the extension system settles across several store
// updates, and the store resets in `beforeEach` require the previous render to be torn down first.
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { mockSessionStore } from '@openmrs/esm-api/mock';
import {
  attach,
  type ExtensionRegistration,
  getAssignedExtensions,
  getExtensionInstancesStore,
  getExtensionInternalStore,
  getExtensionStore,
  registerExtension,
  renderExtension,
  updateInternalExtensionStore,
} from '../../../esm-extensions/src';
import {
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
  useAssignedExtensions,
} from '../../../esm-react-utils/src';
import {
  configExtensionStore,
  configInternalStore,
  defineConfigSchema,
  defineExtensionConfigSchema,
  getConfigStore,
  getExtensionSlotsConfigStore,
  getExtensionsConfigStore,
  provide,
  registerModuleLoad,
  resetConfigSystem,
  temporaryConfigStore,
} from '../../../esm-config/src';

vi.mock('@openmrs/esm-api', async () => {
  const original = await import('@openmrs/esm-api');
  return { ...original, sessionStore: mockSessionStore, refetchCurrentUser: vi.fn() };
});

const moduleName = 'esm-flintstone';

function registerSimpleExtension(name: string, extensionModuleName = moduleName) {
  const registration: ExtensionRegistration = {
    name,
    moduleName: extensionModuleName,
    load: getSyncLifecycle(() => <div>{name}</div>, { moduleName: extensionModuleName, featureName: name }),
    meta: {},
    online: true,
    offline: true,
  };
  registerExtension(registration);
}

function decorate(Component: React.ComponentType) {
  return openmrsComponentDecorator({ moduleName, featureName: 'The Flintstones', disableTranslations: true })(
    Component,
  );
}

describe('Extension system recomputation', () => {
  beforeEach(() => {
    getExtensionInstancesStore().setState({ instances: new Map() });
    temporaryConfigStore.setState({ config: {} });
    configInternalStore.setState({ providedConfigs: [], schemas: {}, moduleLoaded: {} });
    mockSessionStore.setState({});
    getExtensionSlotsConfigStore().setState({ slots: {} });
    getExtensionsConfigStore().setState({ configs: {} });
    getExtensionStore().setState({ slots: {} });
    configExtensionStore.setState({ mountedExtensions: [] });
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
    resetConfigSystem();
    defineConfigSchema(moduleName, {});
    registerModuleLoad(moduleName);
    cleanup();
  });

  it('notifies subscribers when an extension is registered', () => {
    const internalStore = getExtensionInternalStore();
    let notifications = 0;
    const unsubscribe = internalStore.subscribe(() => notifications++);

    registerSimpleExtension('Fred');
    registerSimpleExtension('Wilma');
    unsubscribe();

    // zustand skips notification when an updater returns the same object, so a registration has
    // to produce a new state or nothing downstream learns about it.
    expect(notifications).toBe(2);
    expect(Object.keys(internalStore.getState().extensions)).toEqual(['Fred', 'Wilma']);
  });

  it('does not write to the extension store when a slot re-renders with an equal state object', async () => {
    registerSimpleExtension('Fred');
    attach('state-slot', 'Fred');

    const internalStore = getExtensionInternalStore();
    let setCount: (n: number) => void = () => {};

    function Host() {
      const [count, setCountState] = React.useState(0);
      setCount = setCountState;
      // A fresh object literal every render — overwhelmingly the most common call pattern.
      return <ExtensionSlot name="state-slot" state={{ patientUuid: 'abc-123' }} data-count={count} />;
    }

    const App = decorate(Host);

    await act(async () => {
      render(<App />);
    });

    let writes = 0;
    const unsubscribe = internalStore.subscribe(() => writes++);

    await act(async () => {
      setCount(1);
    });
    await act(async () => {
      setCount(2);
    });
    unsubscribe();

    expect(writes).toBe(0);
    expect(internalStore.getState().slots['state-slot']).toBeDefined();
  });

  it('settles when two slots share a name and disagree about state', async () => {
    registerSimpleExtension('Fred');
    attach('shared-name-slot', 'Fred');

    const internalStore = getExtensionInternalStore();
    let bump: (n: number) => void = () => {};

    function Host() {
      const [count, setCount] = React.useState(0);
      bump = setCount;
      return (
        <div data-count={count}>
          <ExtensionSlot name="shared-name-slot" state={{ patientUuid: 'abc' }} />
          <ExtensionSlot name="shared-name-slot" />
        </div>
      );
    }

    await act(async () => {
      render(React.createElement(decorate(Host)));
    });

    let writes = 0;
    const unsubscribe = internalStore.subscribe(() => writes++);

    await act(async () => {
      bump(1);
    });
    await act(async () => {
      bump(2);
    });
    unsubscribe();

    // Each slot writes only when its own state changes, so they stop overwriting each other
    // rather than trading the slot's state back and forth on every render.
    expect(writes).toBe(0);
  });

  it('keeps slot state out of the store while still letting it reach the extensions', async () => {
    registerExtension({
      name: 'OnlyWhenFlagged',
      moduleName,
      load: getSyncLifecycle(() => <div>OnlyWhenFlagged</div>, { moduleName, featureName: 'flagged' }),
      meta: {},
      online: true,
      offline: true,
      displayExpression: 'flagged',
    });
    attach('changing-state-slot', 'OnlyWhenFlagged');

    const internalStore = getExtensionInternalStore();
    let setFlagged: (flagged: boolean) => void = () => {};

    function Host() {
      const [flagged, setFlaggedState] = React.useState(false);
      setFlagged = setFlaggedState;
      return <ExtensionSlot name="changing-state-slot" state={{ flagged }} />;
    }

    await act(async () => {
      render(React.createElement(decorate(Host)));
    });

    expect(screen.queryByText('OnlyWhenFlagged')).not.toBeInTheDocument();

    let writes = 0;
    const unsubscribe = internalStore.subscribe(() => writes++);

    await act(async () => {
      setFlagged(true);
    });
    unsubscribe();

    // The state belongs to this rendering of the slot, not to the slot, so changing it re-resolves
    // the display condition without touching the store every other rendering shares.
    expect(await screen.findByText('OnlyWhenFlagged')).toBeInTheDocument();
    expect(writes).toBe(0);
    expect(internalStore.getState().slots['changing-state-slot'].state).toBeUndefined();
  });

  it('does not re-render a slot consumer when an unrelated slot changes', async () => {
    registerSimpleExtension('Fred');
    attach('watched-slot', 'Fred');

    let watcherPasses = 0;

    function Watcher() {
      watcherPasses++;
      const extensions = useAssignedExtensions('watched-slot');
      return <span>{extensions.length}</span>;
    }

    await act(async () => {
      render(React.createElement(decorate(Watcher)));
    });

    const countAfterMount = watcherPasses;

    await act(async () => {
      registerSimpleExtension('Barney');
      attach('unrelated-slot', 'Barney');
    });

    expect(watcherPasses).toBe(countAfterMount);

    // The watched slot itself changing must still propagate.
    await act(async () => {
      registerSimpleExtension('Wilma');
      attach('watched-slot', 'Wilma');
    });

    expect(watcherPasses).toBeGreaterThan(countAfterMount);
  });

  it('preserves the identity of slots whose assigned extensions did not change', async () => {
    registerSimpleExtension('Fred');
    attach('stable-slot', 'Fred');

    await act(async () => {
      render(React.createElement(decorate(() => <ExtensionSlot name="stable-slot" />)));
    });

    const extensionStore = getExtensionStore();
    const before = extensionStore.getState().slots['stable-slot'];

    await act(async () => {
      registerSimpleExtension('Barney');
      attach('another-slot', 'Barney');
    });

    expect(extensionStore.getState().slots['stable-slot']).toBe(before);
  });

  it('releases an extension instance when it unmounts', async () => {
    registerSimpleExtension('Fred');
    attach('mounting-slot', 'Fred');

    const instancesStore = getExtensionInstancesStore();
    const App = decorate(() => <ExtensionSlot name="mounting-slot" />);

    for (let i = 0; i < 3; i++) {
      const { unmount } = render(<App />);
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      expect(instancesStore.getState().instances.size).toBe(1);

      unmount();
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      // An instance record must not outlive its parcel.
      expect(instancesStore.getState().instances.size).toBe(0);
      expect(configExtensionStore.getState().mountedExtensions).toEqual([]);
    }
  });

  it('renders an extension whose parcel resolves after the StrictMode remount', async () => {
    registerSimpleExtension('Fred');
    attach('strict-slot', 'Fred');

    const App = decorate(() => <ExtensionSlot data-testid="strict-slot" name="strict-slot" />);

    await act(async () => {
      render(<App />);
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    // StrictMode mounts, tears down and mounts again before the parcel resolves. Teardown state
    // has to be per-mount, or the live component's parcel is unmounted as soon as it arrives.
    expect(screen.getByTestId('strict-slot')).toHaveTextContent('Fred');
    expect(getExtensionInstancesStore().getState().instances.size).toBe(1);
  });

  it('releases an extension instance when the slot unmounts before the bundle loads', async () => {
    let releaseLoad: () => void = () => {};
    const loadGate = new Promise<void>((resolve) => {
      releaseLoad = resolve;
    });

    registerExtension({
      name: 'Slow',
      moduleName,
      meta: {},
      online: true,
      offline: true,
      load: async () => {
        await loadGate;
        return { bootstrap: async () => {}, mount: async () => {}, unmount: async () => {} };
      },
    });
    attach('slow-slot', 'Slow');

    const instancesStore = getExtensionInstancesStore();
    const App = decorate(() => <ExtensionSlot name="slow-slot" />);
    const { unmount } = render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    unmount();
    await act(async () => {
      releaseLoad();
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    // Navigating away while a lazy bundle is still downloading is routine; the record has to be
    // released even though the component never saw a parcel.
    expect(instancesStore.getState().instances.size).toBe(0);
    expect(configExtensionStore.getState().mountedExtensions).toEqual([]);
  });

  it('releases an extension instance when the extension bundle fails to load', async () => {
    registerExtension({
      name: 'Unloadable',
      moduleName,
      meta: {},
      online: true,
      offline: true,
      load: () => Promise.reject(new Error('chunk load failed')),
    });
    attach('unloadable-slot', 'Unloadable');

    const instancesStore = getExtensionInstancesStore();

    // Driven directly rather than through <ExtensionSlot>: `renderExtension` rethrows and
    // `Extension` has no rejection handler, so a failed load reaches the app's global handler.
    await expect(
      renderExtension(document.createElement('div'), 'unloadable-slot', moduleName, 'Unloadable'),
    ).rejects.toThrow('chunk load failed');

    // The record is registered before the load starts, so the failure has to release it.
    expect(instancesStore.getState().instances.size).toBe(0);
    expect(configExtensionStore.getState().mountedExtensions).toEqual([]);
  });

  it('releases an extension instance when the slot unmounts while the parcel is bootstrapping', async () => {
    let releaseBootstrap: () => void = () => {};
    const bootstrapGate = new Promise<void>((resolve) => {
      releaseBootstrap = resolve;
    });

    registerExtension({
      name: 'SlowBootstrap',
      moduleName,
      meta: {},
      online: true,
      offline: true,
      load: async () => ({
        bootstrap: async () => {
          await bootstrapGate;
        },
        mount: async () => {},
        unmount: async () => {},
      }),
    });
    attach('bootstrapping-slot', 'SlowBootstrap');

    const instancesStore = getExtensionInstancesStore();
    const App = decorate(() => <ExtensionSlot name="bootstrapping-slot" />);
    const { unmount } = render(<App />);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    // The parcel exists but hasn't reached MOUNTED, so teardown has to wait for the mount to
    // settle rather than assuming a status it can unmount from.
    unmount();
    await act(async () => {
      releaseBootstrap();
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(instancesStore.getState().instances.size).toBe(0);
    expect(configExtensionStore.getState().mountedExtensions).toEqual([]);
  });

  it('releases an extension instance when the extension fails to mount', async () => {
    registerExtension({
      name: 'Broken',
      moduleName,
      meta: {},
      online: true,
      offline: true,
      load: async () => ({
        bootstrap: async () => {},
        mount: async () => {
          throw new Error('mount failed');
        },
        unmount: async () => {},
      }),
    });
    attach('broken-slot', 'Broken');

    const instancesStore = getExtensionInstancesStore();
    const App = decorate(() => <ExtensionSlot name="broken-slot" />);

    await act(async () => {
      render(<App />);
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    // A parcel that never mounts never settles `unmountPromise`, so the mount rejection is the
    // only thing that can release the record.
    expect(instancesStore.getState().instances.size).toBe(0);
    expect(configExtensionStore.getState().mountedExtensions).toEqual([]);
  });

  it('does not rewrite a module config store when nothing about the config changed', () => {
    const moduleStore = getConfigStore(moduleName);
    let writes = 0;
    const unsubscribe = moduleStore.subscribe(() => writes++);

    // Poking an input store recomputes every module's config, so an unchanged config must not
    // reach the store.

    for (let i = 0; i < 10; i++) {
      configExtensionStore.setState({ mountedExtensions: [...configExtensionStore.getState().mountedExtensions] });
    }
    unsubscribe();

    expect(writes).toBe(0);
  });

  it('does not mutate the config objects it reads while deriving assigned extensions', () => {
    registerSimpleExtension('widget');
    attach('merge-slot', 'widget');

    // Deriving only merges when the slot configures the extension, so without this the merge
    // branch is never taken and the assertions below hold vacuously.
    provide({
      [moduleName]: {
        extensionSlots: { 'merge-slot': { configure: { widget: { fromSlotConfig: true } } } },
      },
    });

    const storedConfig = { untouched: true };
    getExtensionsConfigStore().setState({
      configs: { 'merge-slot': { widget: { loaded: true, config: storedConfig as never } } },
    });

    // The slot's `configure` block still reaches the extension...
    expect(getAssignedExtensions('merge-slot')[0]?.config).toEqual({
      untouched: true,
      fromSlotConfig: true,
    });

    // ...but as a fresh object. The config store owns `storedConfig`, and deriving must not
    // write the slot's overrides into it.
    expect(storedConfig).toEqual({ untouched: true });
    expect(getExtensionsConfigStore().getState().configs['merge-slot']?.['widget']?.config).toEqual({
      untouched: true,
    });
  });

  it("does not remount other rows' extensions when a row with different state arrives", async () => {
    registerSimpleExtension('always');
    registerExtension({
      name: 'conditional',
      moduleName,
      load: getSyncLifecycle(() => <div>conditional</div>, { moduleName, featureName: 'conditional' }),
      meta: {},
      online: true,
      offline: true,
      displayExpression: 'patient.flagged',
    });
    attach('rows-slot', 'always');
    attach('rows-slot', 'conditional');

    let setRows: (n: number) => void = () => {};

    function List() {
      const [rows, setRowsState] = React.useState(1);
      setRows = setRowsState;
      return (
        <div>
          {Array.from({ length: rows }, (_, i) => (
            <ExtensionSlot key={i} name="rows-slot" state={{ patient: { flagged: i % 2 === 0 } }} />
          ))}
        </div>
      );
    }

    await act(async () => {
      render(React.createElement(decorate(List)));
    });

    const everMounted = new Set<string>();
    const unsubscribe = getExtensionInstancesStore().subscribe((state) => {
      for (const instanceId of state.instances.keys()) {
        everMounted.add(instanceId);
      }
    });

    // Rows scroll in one at a time, alternating whether their patient satisfies the condition.
    for (let rows = 2; rows <= 12; rows++) {
      await act(async () => {
        setRows(rows);
      });
    }
    unsubscribe();

    const live = getExtensionInstancesStore().getState().instances.size;

    // Resolving the condition per rendering rather than per slot is what makes this hold: when it
    // was resolved once for the whole slot, each arriving row flipped the answer for every row
    // already on screen, mounting and unmounting their parcels again each time.
    expect(everMounted.size).toBe(live);
    expect(live).toBe(12 + 6);
  });

  it('derives an extension config once however many rows render the same slot', async () => {
    defineExtensionConfigSchema('widget', { greeting: { _default: 'yabba' } });
    provide({ widget: { greeting: 'dabba' } });
    registerSimpleExtension('widget');
    attach('row-slot', 'widget');

    const rows = 25;
    const App = decorate(() => (
      <div>
        {Array.from({ length: rows }, (_, i) => (
          <ExtensionSlot key={i} name="row-slot" />
        ))}
      </div>
    ));

    let extensionConfigWrites = 0;
    const unsubscribe = getExtensionsConfigStore().subscribe(() => extensionConfigWrites++);

    await act(async () => {
      render(<App />);
    });
    unsubscribe();

    expect(await screen.findAllByText('widget')).toHaveLength(rows);
    // A list renders the same slot once per row, but the config system derives one config per
    // slot and extension, so the work must not grow with the number of rows on screen.
    expect(getExtensionsConfigStore().getState().configs['row-slot']).toEqual({
      widget: { loaded: true, config: expect.objectContaining({ greeting: 'dabba' }) },
    });
    expect(extensionConfigWrites).toBe(1);
  });
});
