/* eslint-disable testing-library/no-unnecessary-act, testing-library/no-manual-cleanup */
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { mockSessionStore } from '@openmrs/esm-api/mock';
import {
  attach,
  getExtensionRenderingsStore,
  registerExtension,
  updateInternalExtensionStore,
} from '../../../esm-extensions/src';
import { ExtensionSlot, getSyncLifecycle, openmrsComponentDecorator } from '../../../esm-react-utils/src';
import {
  configExtensionStore,
  configInternalStore,
  defineConfigSchema,
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

function reg(name: string) {
  registerExtension({
    name,
    moduleName,
    load: getSyncLifecycle(() => <div>{name}</div>, { moduleName, featureName: name }),
    meta: {},
    online: true,
    offline: true,
  });
}

/**
 * Slots are recomputed only when an input that affects them changes, so a slot's configuration
 * changing has to invalidate that slot. These cover the case the pre-existing config tests don't:
 * the configuration changing *after* the slot has already rendered, which is what an implementer
 * does from the implementer tools.
 */
describe('runtime slot config changes', () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-lifecycle -- not a render; the rule matches any callee name containing "render"
    getExtensionRenderingsStore().setState({ renderings: new Map() });
    temporaryConfigStore.setState({ config: {} });
    configInternalStore.setState({ providedConfigs: [], schemas: {}, moduleLoaded: {} });
    mockSessionStore.setState({});
    getExtensionSlotsConfigStore().setState({ slots: {} });
    getExtensionsConfigStore().setState({ configs: {} });
    configExtensionStore.setState({ mountedExtensions: [] });
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
    resetConfigSystem();
    defineConfigSchema(moduleName, {});
    registerModuleLoad(moduleName);
    cleanup();
  });

  async function renderSlot() {
    const App = openmrsComponentDecorator({ moduleName, featureName: 'f', disableTranslations: true })(() => (
      <ExtensionSlot data-testid="slot" name="cfg-slot" />
    ));
    await act(async () => {
      render(<App />);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
    });
  }

  function rendered() {
    return Array.from(screen.getByTestId('slot').childNodes).map((n) => (n as HTMLElement).textContent);
  }

  // Polls rather than sleeping: the cascade from a config write to the DOM runs across several
  // store updates and a parcel mount, which is not a fixed amount of wall-clock time.
  async function expectRendered(expected: Array<string | null>) {
    await waitFor(() => expect(rendered()).toEqual(expected));
  }

  it('ADD: config adding an extension after the slot is mounted shows it', async () => {
    reg('Fred');
    reg('Barney');
    attach('cfg-slot', 'Fred');
    await renderSlot();
    await expectRendered(['Fred']);

    await act(async () => {
      provide({ [moduleName]: { extensionSlots: { 'cfg-slot': { add: ['Barney'] } } } });
    });
    await expectRendered(['Fred', 'Barney']);
  });

  it('REMOVE: config removing an extension after the slot is mounted hides it', async () => {
    reg('Fred');
    reg('Wilma');
    attach('cfg-slot', 'Fred');
    attach('cfg-slot', 'Wilma');
    await renderSlot();
    await expectRendered(['Fred', 'Wilma']);

    await act(async () => {
      provide({ [moduleName]: { extensionSlots: { 'cfg-slot': { remove: ['Fred'] } } } });
    });
    await expectRendered(['Wilma']);
  });

  it('ORDER: config reordering after the slot is mounted reorders the DOM', async () => {
    reg('Fred');
    reg('Wilma');
    attach('cfg-slot', 'Fred');
    attach('cfg-slot', 'Wilma');
    await renderSlot();
    await expectRendered(['Fred', 'Wilma']);

    await act(async () => {
      provide({ [moduleName]: { extensionSlots: { 'cfg-slot': { order: ['Wilma', 'Fred'] } } } });
    });
    await expectRendered(['Wilma', 'Fred']);
  });

  it('TEMPORARY CONFIG: implementer-tools style change propagates', async () => {
    reg('Fred');
    reg('Barney');
    attach('cfg-slot', 'Fred');
    await renderSlot();
    await expectRendered(['Fred']);

    await act(async () => {
      temporaryConfigStore.setState({
        config: { [moduleName]: { extensionSlots: { 'cfg-slot': { add: ['Barney'] } } } },
      });
    });
    await expectRendered(['Fred', 'Barney']);
  });

  it('CLEARED: clearing the temporary config reverts the slot to its unconfigured state', async () => {
    reg('Fred');
    reg('Barney');
    attach('cfg-slot', 'Fred');
    await renderSlot();

    await act(async () => {
      temporaryConfigStore.setState({
        config: { [moduleName]: { extensionSlots: { 'cfg-slot': { add: ['Barney'] } } } },
      });
    });
    await expectRendered(['Fred', 'Barney']);

    // What the implementer tools' "clear temporary config" does. The slot loses its config
    // entry entirely, which has to take effect without a page reload.
    await act(async () => {
      temporaryConfigStore.setState({ config: {} });
    });
    await expectRendered(['Fred']);
  });

  it('REPEATED: a second config change after the first still propagates', async () => {
    reg('Fred');
    reg('Barney');
    reg('Betty');
    attach('cfg-slot', 'Fred');
    await renderSlot();

    await act(async () => {
      provide({ [moduleName]: { extensionSlots: { 'cfg-slot': { add: ['Barney'] } } } });
    });
    await expectRendered(['Fred', 'Barney']);

    await act(async () => {
      provide({ [moduleName]: { extensionSlots: { 'cfg-slot': { add: ['Barney', 'Betty'] } } } });
    });
    // Two config-`add`ed extensions with no explicit order come out in the order the
    // configuration lists them.
    await expectRendered(['Fred', 'Barney', 'Betty']);
  });
});
