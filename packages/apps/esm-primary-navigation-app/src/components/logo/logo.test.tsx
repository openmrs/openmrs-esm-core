import React from 'react';
import { useConfig } from '@openmrs/esm-framework';
import { cleanup, render, screen } from '@testing-library/react';
import Logo from './logo.component';

const mockUseConfig = useConfig as jest.Mock;

jest.mock('@openmrs/esm-framework', () => ({
  useConfig: jest.fn(),
  interpolateUrl: jest.fn(),
}));

describe('<Logo/>', () => {
  afterEach(cleanup);

  it('should display OpenMRS logo', () => {
    const mockConfig = { logo: { src: null, alt: null, name: null } };
    mockUseConfig.mockReturnValue(mockConfig);
    render(<Logo />);
    const logo = screen.getByRole('img');
    expect(logo).toBeInTheDocument();
    expect(logo).toContainHTML('svg');
  });

  it('should display name', () => {
    const mockConfig = {
      logo: { src: null, alt: null, name: 'Some weird EMR' },
    };
    mockUseConfig.mockReturnValue(mockConfig);
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
});
