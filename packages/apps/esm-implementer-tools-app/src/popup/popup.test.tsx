import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { implementerToolsStore } from '../store';
import { type ImplementerToolsTab } from '../store';
import Popup from './popup.component';

beforeEach(() => {
  window.i18next = {
    ...window.i18next,
    language: 'en',
    languages: ['en'],
    store: { data: { en: {} } },
  } as unknown as typeof window.i18next;
  window.installedModules = [] as unknown as typeof window.installedModules;
});

afterEach(() => {
  implementerToolsStore.setState((state) => ({ ...state, openTab: 'configuration' }));
});

function renderPopup(visibleTab: ImplementerToolsTab = 'configuration') {
  render(<Popup close={vi.fn()} frontendModules={[]} backendDependencies={[]} visibleTab={visibleTab} />);
}

describe('Popup', () => {
  // The active tab lives in the store so that code outside the popup can navigate to a tab; that
  // round trip is the only thing making the switcher work at all.
  it('switches tabs through the store', async () => {
    const user = userEvent.setup();
    renderPopup();

    await user.click(screen.getByRole('tab', { name: /backend modules/i }));

    expect(implementerToolsStore.getState().openTab).toBe('backend-modules');
  });

  it('shows the tab the store asks for', () => {
    renderPopup('backend-modules');

    expect(screen.getByRole('tab', { name: /backend modules/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('textbox', { name: /search configuration/i })).not.toBeInTheDocument();
  });

  it('renders the tabs in the order the store declares', () => {
    renderPopup();

    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Configuration',
      'Frontend modules',
      'Backend modules',
      'Feature flags',
    ]);
  });

  it('shows the configuration tab by default', () => {
    renderPopup();

    expect(screen.getByRole('textbox', { name: /search configuration/i })).toBeInTheDocument();
  });
});
