import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';

vi.mock('@openmrs/esm-framework/src/internal', () => ({
  getConfig: vi.fn(),
  getCoreTranslation: (key: string) => key,
  interpolateUrl: (url: string) => url.replace('${openmrsBase}', '/openmrs'),
  makeUrl: (path: string) => `/openmrs${path}`,
}));

import { ServerStartingPage, slowStartupMillis } from './server-starting.component';

describe('ServerStartingPage', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the default logo, a spinner, and a link to the setup page', () => {
    render(<ServerStartingPage logo={{ src: '', alt: 'Logo' }} />);

    expect(screen.getByRole('img', { name: 'OpenMRS' })).toBeInTheDocument();
    expect(screen.getByTitle('waitingForServer')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'serverStartingUp' })).toBeInTheDocument();
    expect(screen.getByText('serverStartingUpExplainer')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'viewSetupProgress' })).toHaveAttribute('href', '/openmrs/initialsetup');
  });

  it('shows the configured logo', () => {
    render(<ServerStartingPage logo={{ src: '${openmrsBase}/brand.png', alt: 'Brand logo' }} />);

    expect(screen.getByAltText('Brand logo')).toHaveAttribute('src', '/openmrs/brand.png');
  });

  it('says the startup is taking longer than usual once it has been waiting a long time', () => {
    vi.useFakeTimers();
    render(<ServerStartingPage logo={{ src: '', alt: 'Logo' }} />);

    act(() => vi.advanceTimersByTime(slowStartupMillis - 1));
    expect(screen.getByText('serverStartingUpExplainer')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByText('serverStartingUpSlowExplainer')).toBeInTheDocument();
  });
});
