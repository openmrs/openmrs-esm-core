import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { type AppProps } from 'single-spa';
import { render, screen } from '@testing-library/react';
import Root from './devtools.component';

vi.mock('./import-map.component', () => ({
  __esModule: true,
  default: () => <div role="dialog">Mock Import Map</div>,
  importMapOverridden: false,
}));

vi.mock('@openmrs/esm-framework', async () => {
  const actual = await vi.importActual('@openmrs/esm-framework');
  return {
    ...actual,
    getCoreTranslation: (key: string) => key,
  };
});

const defaultProps: AppProps = {
  name: '@openmrs/esm-devtools-app-page-0',
  singleSpa: {},
  mountParcel: vi.fn(),
};

describe('DevTools', () => {
  beforeEach(() => {
    localStorage.clear();
    delete window.spaEnv;
    vi.resetModules();
  });

  describe('Root component', () => {
    it('should not render DevTools in production without the devtools localStorage flag', () => {
      window.spaEnv = 'production';

      const { container } = render(<Root {...defaultProps} />);
      expect(container).toBeEmptyDOMElement();
    });

    it('should render DevTools in development environments', () => {
      window.spaEnv = 'development';

      render(<Root {...defaultProps} />);

      expect(screen.getByRole('button', { name: '{···}' })).toBeInTheDocument();
    });

    it('should render DevTools when the devtools localStorage flag is set', () => {
      localStorage.setItem('openmrs:devtools', 'true');

      render(<Root {...defaultProps} />);

      expect(screen.getByRole('button', { name: '{···}' })).toBeInTheDocument();
    });
  });

  describe('DevTools component', () => {
    const user = userEvent.setup();

    beforeEach(() => {
      window.spaEnv = 'development';
    });

    it('should toggle DevToolsPopup when clicking trigger button', async () => {
      render(<Root {...defaultProps} />);

      const triggerButton = screen.getByRole('button', { name: '{···}' });
      // Initially, popup should not be present
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Click to open
      await user.click(triggerButton);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click to close
      await user.click(triggerButton);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
