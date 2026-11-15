import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, render, screen } from '@testing-library/react';
import { implementerToolsStore } from './store';
import Root from './implementer-tools.component';

afterEach(() => {
  act(() => implementerToolsStore.setState((state) => ({ ...state, isOpen: false, openTab: 'configuration' })));
});

describe('ImplementerTools', () => {
  it('renders without dying', () => {
    render(<Root />);
  });

  it('opens on the tab the store asks for, as the translation inspector does', async () => {
    window.i18next = {
      ...window.i18next,
      language: 'en',
      languages: ['en'],
      store: { data: { en: {} } },
      hasResourceBundle: () => true,
    } as unknown as typeof window.i18next;
    window.installedModules = [] as unknown as typeof window.installedModules;

    // The app shell supplies the Suspense boundary the lazy popup needs.
    render(
      <React.Suspense fallback={null}>
        <Root />
      </React.Suspense>,
    );

    await act(async () =>
      implementerToolsStore.setState((state) => ({
        ...state,
        isOpen: true,
        openTab: 'translations',
        selectedTranslation: { namespace: '@openmrs/esm-login-app', key: 'loginButton' },
      })),
    );

    expect(await screen.findByRole('tab', { name: /translations/i })).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByRole('textbox', { name: /search translations/i })).toHaveValue('loginButton');
  });
});
