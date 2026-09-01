/* eslint-disable testing-library/no-node-access, testing-library/no-unnecessary-act, testing-library/no-manual-cleanup, testing-library/await-async-queries */
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { type Person } from '@openmrs/esm-api';
import { mockSessionStore } from '@openmrs/esm-api/mock';
import {
  attach,
  getExtensionRenderingsStore,
  registerExtension,
  updateInternalExtensionStore,
} from '../../../esm-extensions/src';
import {
  ExtensionSlot,
  getSyncLifecycle,
  openmrsComponentDecorator,
  useConfig,
  useExtensionStore,
} from '../../../esm-react-utils/src';
import {
  configInternalStore,
  defineConfigSchema,
  getExtensionSlotsConfigStore,
  getExtensionsConfigStore,
  provide,
  registerModuleLoad,
  resetConfigSystem,
  temporaryConfigStore,
  Type,
} from '../../../esm-config/src';

vi.mock('@openmrs/esm-api', async () => {
  const original = await import('@openmrs/esm-api');
  return {
    ...original,
    sessionStore: mockSessionStore,
    refetchCurrentUser: vi.fn(),
  };
});

describe('Interaction between configuration and extension systems', () => {
  beforeEach(() => {
    // A rendering outliving its module's schema makes the config system derive a config for an
    // extension this test never registered.
    // eslint-disable-next-line testing-library/no-render-in-lifecycle -- not a render; the rule matches any callee name containing "render"
    getExtensionRenderingsStore().setState({ renderings: new Map() });
    temporaryConfigStore.setState({ config: {} });
    configInternalStore.setState({ providedConfigs: [], schemas: {}, moduleLoaded: {} });
    mockSessionStore.setState({});
    getExtensionSlotsConfigStore().setState({ slots: {} });
    getExtensionsConfigStore().setState({ configs: {} });
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
    resetConfigSystem();
  });

  afterEach(() => {
    cleanup();
  });

  it('Config should add, order, and remove extensions within slots', async () => {
    registerSimpleExtension('Fred', 'esm-flintstone');
    registerSimpleExtension('Wilma', 'esm-flintstone');
    registerSimpleExtension('Barney', 'esm-rubble');
    registerSimpleExtension('Betty', 'esm-rubble');

    attach('A slot', 'Fred');
    attach('A slot', 'Wilma');
    defineConfigSchema('esm-flintstone', {});
    registerModuleLoad('esm-flintstone');

    provide({
      'esm-flintstone': {
        extensionSlots: {
          'A slot': {
            add: ['Barney', 'Betty'],
            order: ['Betty', 'Wilma'],
            remove: ['Fred'],
          },
        },
      },
    });

    const App = openmrsComponentDecorator({
      moduleName: 'esm-flintstone',
      featureName: 'The Flintstones',
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

    act(() => {
      render(<App />);
    });

    await waitFor(async () => {
      await screen.findByText('Betty');
      const slot = screen.getByTestId('slot');
      const extensions = slot.childNodes;
      expect(extensions[0]).toHaveTextContent('Betty');
      expect(extensions[1]).toHaveTextContent('Wilma');
      expect(extensions[2]).toHaveTextContent('Barney');
      expect(screen.queryByText('Fred')).not.toBeInTheDocument();
    });
  });

  it("Extensions should recieve config from module and from 'configure' key", async () => {
    registerSimpleExtension('Pebbles', 'esm-flintstone', true);
    defineConfigSchema('esm-flintstone', {
      town: { _type: Type.String, _default: 'Bedrock' },
    });
    registerModuleLoad('esm-flintstone');

    attach('Flintstone slot', 'Pebbles');
    attach('Future slot', 'Pebbles');
    provide({
      'esm-flintstone': {
        town: 'Springfield',
        extensionSlots: {
          'Future slot': {
            configure: {
              Pebbles: {
                town: 'New New York',
              },
            },
          },
        },
      },
    });

    const App = openmrsComponentDecorator({
      moduleName: 'esm-flintstone',
      featureName: 'The Flintstones',
      disableTranslations: true,
    })(() => (
      <>
        <ExtensionSlot data-testid="flintstone-slot" name="Flintstone slot" />
        <ExtensionSlot data-testid="future-slot" name="Future slot" />
      </>
    ));

    act(() => {
      render(<App />);
    });

    screen.findAllByText(/.*Pebbles.*/);
    const flintstonePebbles = screen.getByTestId('flintstone-slot');
    const futurePebbles = screen.getByTestId('future-slot');

    await waitFor(() => {
      expect(flintstonePebbles).toHaveTextContent(/Pebbles:.*Springfield/);
      expect(futurePebbles).toHaveTextContent(/Pebbles:.*New New York/);
    });
  });

  it('Should be possible to attach the same extension twice with different configurations', async () => {
    registerSimpleExtension('pet', 'esm-characters', true);
    defineConfigSchema('esm-characters', {
      name: { _type: Type.String, _default: '(no-name)' },
    });
    registerModuleLoad('esm-characters');

    attach('Flintstone slot', 'pet#Dino');
    attach('Flintstone slot', 'pet#BabyPuss');
    provide({
      'esm-flintstone': {
        extensionSlots: {
          'Flintstone slot': {
            configure: {
              'pet#Dino': {
                name: 'Dino',
              },
              'pet#BabyPuss': {
                name: 'Baby Puss',
              },
            },
          },
        },
      },
    });

    const App = openmrsComponentDecorator({
      moduleName: 'esm-flintstone',
      featureName: 'The Flintstones',
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="flintstone-slot" name="Flintstone slot" />);

    act(() => {
      render(<App />);
    });

    screen.findAllByText(/.*Dino.*/);
    const slot = screen.getByTestId('flintstone-slot');

    await waitFor(() => {
      expect(slot.firstChild).toHaveTextContent(/Dino/);
      expect(slot.lastChild).toHaveTextContent(/Baby Puss/);
    });
  });

  it('Should give each extension instance its own config in every rendering of the slot', async () => {
    registerSimpleExtension('obs', 'esm-widgets', true);
    defineConfigSchema('esm-widgets', {
      concept: { _type: Type.String, _default: '(none)' },
    });
    registerModuleLoad('esm-widgets');

    attach('Vitals slot', 'obs#weight');
    attach('Vitals slot', 'obs#height');
    provide({
      'esm-chart': {
        extensionSlots: {
          'Vitals slot': {
            configure: {
              'obs#weight': { concept: 'Weight (kg)' },
              'obs#height': { concept: 'Height (cm)' },
            },
          },
        },
      },
    });

    const App = openmrsComponentDecorator({
      moduleName: 'esm-chart',
      featureName: 'The chart',
      disableTranslations: true,
    })(() => (
      <>
        <ExtensionSlot data-testid="row-1" name="Vitals slot" />
        <ExtensionSlot data-testid="row-2" name="Vitals slot" />
      </>
    ));

    act(() => {
      render(<App />);
    });

    await waitFor(() => {
      for (const testId of ['row-1', 'row-2']) {
        const slot = screen.getByTestId(testId);
        expect(slot.firstChild).toHaveTextContent(/Weight \(kg\)/);
        expect(slot.lastChild).toHaveTextContent(/Height \(cm\)/);
      }
    });
  });

  it('Slot config should update with temporary config', async () => {
    registerSimpleExtension('Pearl', 'esm-slaghoople');
    attach('A slot', 'Pearl');
    defineConfigSchema('esm-slaghoople', {});
    registerModuleLoad('esm-flintstone');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-slaghoople',
      featureName: 'The Slaghooples',
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

    act(() => {
      render(<App />);
    });

    await screen.findByText('Pearl');

    act(() => {
      temporaryConfigStore.setState({
        config: {
          'esm-slaghoople': {
            extensionSlots: {
              'A slot': {
                remove: ['Pearl'],
              },
            },
          },
        },
      });
    });

    await waitFor(() => expect(screen.queryByText('Pearl')).not.toBeInTheDocument());
  });

  it('Extension config should update with temporary config', async () => {
    registerSimpleExtension('Mr. Slate', 'esm-flintstone', true);
    attach('A slot', 'Mr. Slate');
    defineConfigSchema('esm-flintstone', { tie: { _default: 'green' } });
    registerModuleLoad('esm-flintstone');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-quarry',
      featureName: 'The Flintstones',
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

    act(() => {
      render(<App />);
    });
    await screen.findByText(/Mr. Slate/);
    expect(screen.getByTestId('slot')).toHaveTextContent(/green/);

    act(() => {
      temporaryConfigStore.setState({
        config: {
          'esm-quarry': {
            extensionSlots: {
              'A slot': {
                configure: {
                  'Mr. Slate': { tie: 'black' },
                },
              },
            },
          },
        },
      });
    });

    expect(screen.getByTestId('slot')).toHaveTextContent(/black/);
    expect(screen.queryByText('green')).not.toBeInTheDocument();
  });

  // TODO restore this test
  it.skip('Extension config should be available in extension store', async () => {
    registerSimpleExtension('Bamm-Bamm', 'esm-flintstone', false);
    attach('A slot', 'Bamm-Bamm');
    defineConfigSchema('esm-flintstone', { clothes: { _default: 'leopard' } });
    registerModuleLoad('esm-flintstone');

    function RootComponent() {
      const store = useExtensionStore();
      return (
        <div>
          <ExtensionSlot data-testid="slot" name="A slot" />
          {store.slots['A slot'].candidateExtensions.map((e) => (
            <div key={e.name}>{JSON.stringify(e.config)}</div>
          ))}
        </div>
      );
    }

    const App = openmrsComponentDecorator({
      moduleName: 'esm-flintstone',
      featureName: 'The Flintstones',
      disableTranslations: true,
    })(RootComponent);

    act(() => {
      render(<App />);
    });

    await screen.findByTestId(/slot/);
    expect(screen.getByText(/clothes/)).toHaveTextContent(/leopard/);

    act(() => {
      temporaryConfigStore.setState({
        config: {
          'esm-flintstone': {
            extensionSlots: {
              'A slot': {
                configure: {
                  'Bamm-Bamm': { clothes: 'tiger' },
                },
              },
            },
          },
        },
      });
    });

    expect(screen.getByText(/clothes/)).toHaveTextContent(/tiger/);
  });

  it('should not show extension when user lacks configured privilege', async () => {
    mockSessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: '1',
        user: {
          uuid: '1',
          display: 'Non-Admin',
          username: 'nonadmin',
          systemId: 'nonadmin',
          userProperties: {},
          person: {} as Person,
          privileges: [],
          roles: [],
          retired: false,
          locale: 'en',
          allowedLocales: ['en'],
        },
      },
    });

    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    registerSimpleExtension('Wilma', 'esm-flintstones', true);
    attach('A slot', 'Schmoo');
    attach('A slot', 'Wilma');
    defineConfigSchema('esm-bedrock', {});
    defineConfigSchema('esm-flintstones', {});
    registerModuleLoad('esm-bedrock');
    registerModuleLoad('esm-flintstones');
    provide({
      'esm-bedrock': {
        'Display conditions': {
          privileges: ['Yabadabadoo!'],
        },
      },
    });
    provide({
      'esm-flintstones': {},
    });

    const App = openmrsComponentDecorator({
      moduleName: 'esm-bedrock',
      featureName: 'Bedrock',
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

    act(() => {
      render(<App />);
    });

    await waitFor(() => {
      const slot = screen.getByTestId('slot');
      expect(slot.firstChild).toHaveAttribute('data-extension-id', 'Wilma');
      expect(screen.queryAllByText(/\bSchmoo\b/)).toHaveLength(0);
    });
  });

  it('should show extension when user has configured privilege', async () => {
    mockSessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: '1',
        user: {
          uuid: '1',
          display: 'Non-Admin',
          username: 'nonadmin',
          systemId: 'nonadmin',
          userProperties: {},
          person: {} as Person,
          privileges: [{ uuid: '1', name: 'Yabadabadoo!', display: 'Yabadabadoo!' }],
          roles: [],
          retired: false,
          locale: 'en',
          allowedLocales: ['en'],
        },
      },
    });

    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    attach('A slot', 'Schmoo');
    defineConfigSchema('esm-bedrock', {});
    registerModuleLoad('esm-bedrock');
    provide({
      'esm-bedrock': {
        'Display conditions': {
          privileges: ['Yabadabadoo!'],
        },
      },
    });

    const App = openmrsComponentDecorator({
      moduleName: 'esm-bedrock',
      featureName: 'Bedrock',
      disableTranslations: true,
    })(() => <ExtensionSlot data-testid="slot" name="A slot" />);

    act(() => {
      render(<App />);
    });

    await screen.findByTestId(/slot/);
    expect(screen.getByTestId('slot').firstChild).toHaveAttribute('data-extension-id', 'Schmoo');
  });

  it('should only show extensions users have default privilege for', async () => {
    // Set up initial session state before registering extensions
    mockSessionStore.setState({
      loaded: true,
      session: {
        authenticated: true,
        sessionId: '1',
        user: {
          uuid: '1',
          display: 'Non-Admin',
          username: 'nonadmin',
          systemId: 'nonadmin',
          userProperties: {},
          person: {} as Person,
          privileges: [{ uuid: '1', name: 'YOWTCH!', display: 'YOWTCH!' }],
          roles: [],
          retired: false,
          locale: 'en',
          allowedLocales: ['en'],
        },
      },
    });

    registerSimpleExtension('Schmoo', 'esm-bedrock', true, 'Yabadabadoo!');
    registerSimpleExtension('Wilma', 'esm-flintstones', true, 'YOWTCH!');
    attach('A slot', 'Schmoo');
    attach('A slot', 'Wilma');
    defineConfigSchema('esm-bedrock', {});
    defineConfigSchema('esm-flintstones', {});
    registerModuleLoad('esm-bedrock');
    registerModuleLoad('esm-flintstones');
    provide({ 'esm-bedrock': {} });
    provide({ 'esm-flintstones': {} });

    function RootComponent() {
      return (
        <div>
          <ExtensionSlot data-testid="slot" name="A slot" />
        </div>
      );
    }

    const App = openmrsComponentDecorator({
      moduleName: 'esm-bedrock',
      featureName: 'Bedrock',
      disableTranslations: true,
    })(RootComponent);

    act(() => {
      render(<App />);
    });

    await waitFor(() => {
      const slot = screen.getByTestId('slot');
      expect(slot.firstChild).toHaveAttribute('data-extension-id', 'Wilma');
      expect(screen.queryAllByText(/\bSchmoo\b/)).toHaveLength(0);
    });
  });
});

async function registerSimpleExtension(
  name: string,
  moduleName: string,
  takesConfig: boolean = false,
  privileges?: string | string[],
) {
  const SimpleComponent = () => <div>{name}</div>;
  const ConfigurableComponent = () => {
    const config = useConfig();
    return (
      <div>
        {name}: {JSON.stringify(config)}
      </div>
    );
  };

  registerExtension({
    name,
    moduleName,
    load: getSyncLifecycle(takesConfig ? ConfigurableComponent : SimpleComponent, {
      moduleName,
      featureName: moduleName,
      disableTranslations: true,
    }),
    meta: {},
    privileges,
  });
}
