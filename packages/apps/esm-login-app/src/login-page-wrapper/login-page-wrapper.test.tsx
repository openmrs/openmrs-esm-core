import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-framework';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import LoginPageWrapper from './login-page-wrapper.component';

const mockUseConfig = vi.mocked(useConfig);

describe('LoginPageWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseConfig.mockReturnValue(mockConfig);
  });

  it('renders a configurable logo', () => {
    const customLogoConfig = {
      src: 'https://some-image-host.com/foo.png',
      alt: 'Custom logo',
    };
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      logo: customLogoConfig,
    });

    renderWithRouter(LoginPageWrapper);

    const logo = screen.getByAltText(customLogoConfig.alt);

    expect(screen.queryByTitle(/openmrs logo/i)).not.toBeInTheDocument();
    expect(logo).toHaveAttribute('src', customLogoConfig.src);
    expect(logo).toHaveAttribute('alt', customLogoConfig.alt);
  });

  it('does not render announcement banners by default', () => {
    renderWithRouter(LoginPageWrapper, { children: <div /> }, { route: '/login' });
    expect(screen.queryByText(/Planned downtime/i)).not.toBeInTheDocument();
  });

  it('renders configured announcement banners stacked above the form', () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      announcements: [
        { title: '', text: 'Planned downtime tonight at 10pm', kind: 'warning' },
        { title: 'Heads up', text: 'New release shipping Friday', kind: 'info' },
      ],
    });

    renderWithRouter(LoginPageWrapper, { children: <div /> }, { route: '/login' });

    expect(screen.getByText('Planned downtime tonight at 10pm')).toBeInTheDocument();
    expect(screen.getByText('New release shipping Friday')).toBeInTheDocument();
    expect(screen.getByText('Heads up')).toBeInTheDocument();
  });

  it('interpolates relative background.image paths via interpolateUrl', () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      background: { image: '${openmrsSpaBase}/assets/bg.jpg', color: '' },
    });

    renderWithRouter(LoginPageWrapper, { children: <div /> }, { route: '/login' });
    const root = screen.getByTestId('login-container');

    const bgImage = root.style.getPropertyValue('--login-bg-image');
    expect(bgImage).toContain('/openmrs/spa/assets/bg.jpg');
    expect(bgImage).not.toContain('${openmrsSpaBase}');
    expect(root.className).toMatch(/containerWithImage/);
  });

  it('applies a background color when only background.color is configured', () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      background: { image: '', color: '#0066cc' },
    });

    renderWithRouter(LoginPageWrapper, { children: <div /> }, { route: '/login' });
    const root = screen.getByTestId('login-container');

    expect(root.style.getPropertyValue('--login-bg-color')).toBe('#0066cc');
    expect(root.style.getPropertyValue('--login-bg-image')).toBe('');
    expect(root.className).toMatch(/containerWithColor/);
    expect(root.className).not.toMatch(/containerWithImage/);
  });
});
