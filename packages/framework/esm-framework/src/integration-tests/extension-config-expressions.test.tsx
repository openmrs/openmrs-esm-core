/* eslint-disable */
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { type Person } from '@openmrs/esm-api';
import { mockSessionStore } from '@openmrs/esm-api/mock';
import { attach, registerExtension, updateInternalExtensionStore } from '../../../esm-extensions';
import { ExtensionSlot, getSyncLifecycle, openmrsComponentDecorator, useConfig } from '../../../esm-react-utils/src';
import {
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
  return {
    ...original,
    sessionStore: mockSessionStore,
    refetchCurrentUser: vi.fn(),
  };
});

/**
 * Expression evaluation tests
 *
 * These tests are in a separate file due to test isolation issues. When run with other
 * extension/config tests, there is accumulation of state/subscriptions that causes infinite
 * update loops. The tests pass when run individually or in this isolated file.
 *
 * Root cause: Even with subscription cleanup (resetConfigSystem) and deep equality checks,
 * running these tests alongside other tests that manipulate the config system creates
 * conditions where store updates don't settle. This is a test environment issue, not a
 * production code bug - the functionality works correctly in isolation and in production.
 */
describe('Expression evaluation in extension display conditions', () => {
  beforeEach(() => {
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

  it('should show extension when the expression evalutes to true', async () => {
    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    attach('A slot', 'Schmoo');
    defineConfigSchema('esm-bedrock', {});
    registerModuleLoad('esm-bedrock');
    provide({
      'esm-bedrock': {
        'Display conditions': {
          expression: 'true',
        },
      },
    });

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

    await screen.findByTestId(/slot/);
    expect(screen.getByTestId('slot').firstChild).toHaveAttribute('data-extension-id', 'Schmoo');
  });

  it('should hide extension when the expression evaluates to false', async () => {
    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    attach('A slot', 'Schmoo');
    defineConfigSchema('esm-bedrock', {});
    registerModuleLoad('esm-bedrock');
    provide({
      'esm-bedrock': {
        'Display conditions': {
          expression: 'false',
        },
      },
    });

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

    await screen.findByTestId(/slot/);
    expect(screen.getByTestId('slot').firstChild).toBeNull();
  });

  it('should show extension using a complex expression', async () => {
    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    attach('A slot', 'Schmoo');
    defineConfigSchema('esm-bedrock', {});
    registerModuleLoad('esm-bedrock');
    provide({
      'esm-bedrock': {
        'Display conditions': {
          expression: 'session.user ? session.user.privileges.some(p => p.display === "YOWTCH!") : false',
        },
      },
    });

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

    render(<App />);

    // Update session state after rendering so the component can react to the change
    await act(async () => {
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
            privileges: [{ uuid: '1', display: 'YOWTCH!' }],
            roles: [],
            retired: false,
            locale: 'en',
            allowedLocales: ['en'],
          },
        },
      });
    });

    await waitFor(() => {
      const slot = screen.getByTestId('slot');
      expect(slot.firstChild).toHaveAttribute('data-extension-id', 'Schmoo');
    });
  });

  it('should hide extension using a complex expression', async () => {
    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    attach('A slot', 'Schmoo');
    defineConfigSchema('esm-bedrock', {});
    registerModuleLoad('esm-bedrock');
    provide({
      'esm-bedrock': {
        'Display conditions': {
          expression: 'session.user.privileges.every(p => p.display !== "YOWTCH!")',
        },
      },
    });

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

    render(<App />);

    // Update session state after rendering so the component can react to the change
    await act(async () => {
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
            privileges: [{ uuid: '1', display: 'YOWTCH!' }],
            roles: [],
            retired: false,
            locale: 'en',
            allowedLocales: ['en'],
          },
        },
      });
    });

    await waitFor(() => {
      const slot = screen.getByTestId('slot');
      expect(slot.firstChild).toBeNull();
    });
  });

  it('should hide extension if expression contains an error', async () => {
    registerSimpleExtension('Schmoo', 'esm-bedrock', true);
    attach('A slot', 'Schmoo');
    defineConfigSchema('esm-bedrock', {});
    registerModuleLoad('esm-bedrock');

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

    render(<App />);

    // Provide config with error expression after rendering so the component can react to the change
    await act(async () => {
      provide({
        'esm-bedrock': {
          'Display conditions': {
            expression: 'NotDefined === true',
          },
        },
      });
    });

    await waitFor(() => {
      const slot = screen.getByTestId('slot');
      expect(slot.firstChild).toBeNull();
    });
  }, 10000);
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
