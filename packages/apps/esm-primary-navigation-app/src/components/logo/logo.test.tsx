import React from 'react';
import { vi, describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../../config-schema';
import Logo from './logo.component';

vi.mock('@openmrs/esm-framework', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-framework')>();
  return {
    ...actual,
    useConfig: vi.fn(),
  };
});

const mockUseConfig = vi.mocked(useConfig);

describe('Logo', () => {
  it('should display the OpenMRS logo by default', () => {
    const mockConfig = { logo: { src: null, alt: null, name: null } };
    mockUseConfig.mockReturnValue(mockConfig as ConfigSchema);

    render(<Logo />);

    const logo = screen.getByRole('img');

    expect(logo).toBeInTheDocument();
    expect(logo).toContainHTML('svg');
  });

  it('should display name', () => {
    const mockConfig = {
      logo: { src: null, alt: null, name: 'Some weird EMR', link: null },
      externalRefLinks: null,
    };

    mockUseConfig.mockReturnValue(mockConfig as ConfigSchema);

    render(<Logo />);

    expect(screen.getByText(/Some weird EMR/i)).toBeInTheDocument();
  });

  it('should display image logo', () => {
    const mockConfig = {
      logo: {
        src: 'https://someimage.png',
        alt: 'alternative text',
        name: null,
      },
    };

    mockUseConfig.mockReturnValue(mockConfig);

    render(<Logo />);

    const logo = screen.getByRole('img');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('alt');
  });

  it('should handle image load errors', () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockConfig = {
      logo: {
        src: 'invalid-image.png',
        alt: 'alt text',
        name: null,
      },
    };

    mockUseConfig.mockReturnValue(mockConfig);

    render(<Logo />);

    const img = screen.getByRole('img');

    const errorEvent = new Event('error');
    img.dispatchEvent(errorEvent);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to load logo image:', expect.any(Object));
    consoleSpy.mockRestore();
  });
});
