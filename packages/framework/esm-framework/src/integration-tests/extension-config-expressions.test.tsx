/* eslint-disable testing-library/no-node-access, testing-library/no-unnecessary-act, testing-library/no-manual-cleanup, jest-dom/prefer-empty, testing-library/prefer-presence-queries */
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { type Person } from '@openmrs/esm-api';
import { mockSessionStore } from '@openmrs/esm-api/mock';
import {
  attach,
  getExtensionRenderingsStore,
  registerExtension,
  updateInternalExtensionStore,
} from '../../../esm-extensions/src';
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
            privileges: [{ uuid: '1', name: 'YOWTCH!', display: 'YOWTCH!' }],
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
            privileges: [{ uuid: '1', name: 'YOWTCH!', display: 'YOWTCH!' }],
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

  it('evaluates a display condition against each rendering of a slot', async () => {
    registerExtension({
      name: 'Always',
      moduleName: 'esm-bedrock',
      load: getSyncLifecycle(() => <div>Always</div>, {
        moduleName: 'esm-bedrock',
        featureName: 'Bedrock',
        disableTranslations: true,
      }),
      meta: {},
    });
    registerExtension({
      name: 'Flagged',
      moduleName: 'esm-bedrock',
      load: getSyncLifecycle(() => <div>Flagged</div>, {
        moduleName: 'esm-bedrock',
        featureName: 'Bedrock',
        disableTranslations: true,
      }),
      meta: {},
      displayExpression: 'patient.flagged',
    });
    attach('rows-slot', 'Always');
    attach('rows-slot', 'Flagged');

    // A virtualized list renders the same slot once per row, each with its own patient. The slot
    // is not "a place on the screen" here, so the condition has to be evaluated per rendering.
    const Rows = openmrsComponentDecorator({
      moduleName: 'esm-bedrock',
      featureName: 'Bedrock',
      disableTranslations: true,
    })(() => (
      <div>
        <div data-testid="row-flagged">
          <ExtensionSlot name="rows-slot" state={{ patient: { flagged: true } }} />
        </div>
        <div data-testid="row-plain">
          <ExtensionSlot name="rows-slot" state={{ patient: { flagged: false } }} />
        </div>
      </div>
    ));

    await act(async () => {
      render(<Rows />);
    });

    await waitFor(() => expect(within(screen.getByTestId('row-flagged')).getByText('Always')).toBeInTheDocument());

    expect(within(screen.getByTestId('row-flagged')).getByText('Flagged')).toBeInTheDocument();
    expect(within(screen.getByTestId('row-plain')).getByText('Always')).toBeInTheDocument();
    expect(within(screen.getByTestId('row-plain')).queryByText('Flagged')).not.toBeInTheDocument();
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
