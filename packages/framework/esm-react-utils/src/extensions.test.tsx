/* eslint-disable */
import React, { useReducer } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import { registerFeatureFlag, setFeatureFlag } from '@openmrs/esm-feature-flags';
import {
  attach,
  getExtensionNameFromId,
  registerExtension,
  updateInternalExtensionStore,
} from '@openmrs/esm-extensions';
import {
  getSyncLifecycle,
  Extension,
  ExtensionSlot,
  openmrsComponentDecorator,
  useExtensionSlotMeta,
  useRenderableExtensions,
} from '.';

describe('ExtensionSlot, Extension, and useExtensionSlotMeta', () => {
  beforeEach(() => {
    updateInternalExtensionStore(() => ({ slots: {}, extensions: {} }));
  });

  it('Extension receives state changes passed through (not using <Extension>)', async () => {
    const user = userEvent.setup();

    function EnglishExtension({ suffix }) {
      return <div>English{suffix}</div>;
    }

    registerSimpleExtension('English', 'esm-languages-app', EnglishExtension);
    attach('Box', 'English');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer((suffix) => (suffix == '!' ? '?' : '!'), '!');
      return (
        <div>
          <ExtensionSlot name="Box" state={{ suffix }} />
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });

    render(<App />);

    expect(await screen.findByText(/English/)).toBeInTheDocument();
    expect(screen.getByText(/English/)).toHaveTextContent('English!');
    await user.click(screen.getByText('Toggle suffix'));
    expect(screen.getByText(/English/)).toHaveTextContent('English?');
  });

  it('Extension receives state changes (using <Extension>)', async () => {
    const user = userEvent.setup();

    function HaitianCreoleExtension({ suffix }) {
      return <div>Haitian Creole{suffix}</div>;
    }

    registerSimpleExtension('Haitian', 'esm-languages-app', HaitianCreoleExtension);
    attach('Box', 'Haitian');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer((suffix) => (suffix == '!' ? '?' : '!'), '!');

      return (
        <div>
          <ExtensionSlot name="Box">
            {suffix}
            <Extension state={{ suffix }} />
          </ExtensionSlot>
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });

    render(<App />);

    expect(await screen.findByText(/Haitian/)).toBeInTheDocument();
    expect(screen.getByText(/Haitian/)).toHaveTextContent('Haitian Creole!');
    await user.click(screen.getByText('Toggle suffix'));
    expect(screen.getByText(/Haitian/)).toHaveTextContent('Haitian Creole?');
  });

  it.skip('ExtensionSlot throws error if both state and children provided', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const App = () => (
      <ExtensionSlot name="Box" state={{ color: 'red' }}>
        <Extension />
      </ExtensionSlot>
    );

    expect(() => render(<App />)).toThrow();
    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        message: expect.stringMatching(
          /Both children and state have been provided. If children are provided, the state must be passed as a prop to the `Extension` component/i,
        ),
      }),
    );
    consoleError.mockRestore();
  });

  it('Extension Slot receives meta', async () => {
    registerSimpleExtension('Spanish', 'esm-languages-app', undefined, {
      code: 'es',
    });
    attach('Box', 'Spanish');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => {
      const metas = useExtensionSlotMeta('Box');
      return (
        <div>
          <ExtensionSlot name="Box">
            {(extension) => (
              <div>
                <h1>{metas[getExtensionNameFromId(extension?.id ?? '')].code}</h1>
                <Extension />
              </div>
            )}
          </ExtensionSlot>
        </div>
      );
    });

    render(<App />);

    expect(await screen.findByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('es');
  });

  it('Both meta and state can be used at the same time', async () => {
    const user = userEvent.setup();
    function SwahiliExtension({ suffix }) {
      return <div>Swahili{suffix}</div>;
    }

    registerSimpleExtension('Swahili', 'esm-languages-app', SwahiliExtension, {
      code: 'sw',
    });

    attach('Box', 'Swahili');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => {
      const [suffix, toggleSuffix] = useReducer((suffix) => (suffix == '!' ? '?' : '!'), '!');
      const metas = useExtensionSlotMeta('Box');
      return (
        <div>
          <ExtensionSlot name="Box">
            {(extension) => (
              <div>
                <h1>{metas[getExtensionNameFromId(extension?.id ?? '')].code}</h1>
                <Extension state={{ suffix }} />
              </div>
            )}
          </ExtensionSlot>
          <button onClick={toggleSuffix}>Toggle suffix</button>
        </div>
      );
    });

    render(<App />);

    expect(await screen.findByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('sw');
    await waitFor(() => expect(screen.getByText(/Swahili/)).toHaveTextContent('Swahili!'));
    await user.click(screen.getByText('Toggle suffix'));
    await waitFor(() => expect(screen.getByText(/Swahili/)).toHaveTextContent('Swahili?'));
  });

  it('Extension Slot renders function children', async () => {
    registerSimpleExtension('Urdu', 'esm-languages-app', undefined, {
      code: 'urd',
    });
    registerSimpleExtension('Hindi', 'esm-languages-app', undefined, {
      code: 'hi',
    });

    attach('Box', 'Urdu');
    attach('Box', 'Hindi');

    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => {
      return (
        <div>
          <ExtensionSlot name="Box">
            {(extension) => (
              <div data-testid={extension.name}>
                <h2>{extension.meta.code}</h2>
                <Extension />
              </div>
            )}
          </ExtensionSlot>
        </div>
      );
    });

    render(<App />);

    expect(await screen.findByTestId('Urdu')).toBeInTheDocument();
    expect(within(screen.getByTestId('Urdu')).getByRole('heading')).toHaveTextContent('urd');
    expect(within(screen.getByTestId('Hindi')).getByRole('heading')).toHaveTextContent('hi');
  });

  it('Extensions behind feature flags only render when their feature flag is enabled', async () => {
    registerSimpleExtension('Arabic', 'esm-languages-app');
    registerSimpleExtension('Turkish', 'esm-languages-app', undefined, undefined, 'turkic');
    registerSimpleExtension('Turkmeni', 'esm-languages-app', undefined, undefined, 'turkic');
    registerSimpleExtension('Kurmanji', 'esm-languages-app', undefined, undefined, 'kurdish');

    attach('Box', 'Arabic');
    attach('Box', 'Turkish');
    attach('Box', 'Turkmeni');
    attach('Box', 'Kurmanji');

    registerFeatureFlag('turkic', '', '');
    registerFeatureFlag('kurdish', '', '');
    setFeatureFlag('turkic', true);

    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => <ExtensionSlot name="Box" />);

    render(<App />);

    await waitFor(() => expect(screen.getByText(/Turkmeni/)).toBeInTheDocument());
    expect(screen.getByText('Arabic')).toBeInTheDocument();
    expect(screen.getByText('Turkish')).toBeInTheDocument();
    expect(screen.queryByText('Kurmanji')).not.toBeInTheDocument();
    act(() => setFeatureFlag('kurdish', true));
    await waitFor(() => expect(screen.getByText('Kurmanji')).toBeInTheDocument());
  });

  it('useRenderableExtensions returns registered extensions', async () => {
    function SpanishExtension({ suffix }) {
      return <div>Spanish{suffix}</div>;
    }

    registerSimpleExtension('Spanish', 'esm-languages-app', SpanishExtension, {
      code: 'es',
    });
    attach('Box', 'Spanish');
    const App = openmrsComponentDecorator({
      moduleName: 'esm-languages-app',
      featureName: 'Languages',
      disableTranslations: true,
    })(() => {
      const utils = useRenderableExtensions('Box');
      const Ext = utils[0];
      return <Ext state={{ suffix: ' hola' }} />;
    });
    render(<App />);

    expect(await screen.findByText('Spanish hola')).toBeInTheDocument();
  });
});

function registerSimpleExtension(
  name: string,
  moduleName: string,
  Component?: React.ComponentType<any>,
  meta: object = {},
  featureFlag?: string,
) {
  const SimpleComponent = () => <div>{name}</div>;
  registerExtension({
    name,
    moduleName,
    load: getSyncLifecycle(Component ?? SimpleComponent, {
      moduleName,
      featureName: moduleName,
      disableTranslations: true,
    }),
    meta,
    featureFlag,
  });
}
