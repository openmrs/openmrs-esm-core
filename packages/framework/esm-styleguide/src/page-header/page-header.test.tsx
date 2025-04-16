import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getConfig } from '@openmrs/esm-config';
import { getCoreTranslation } from '@openmrs/esm-translations';
import { PageHeaderContent } from './page-header.component';

const mockGetConfig = vi.mocked(getConfig);
const mockGetCoreTranslation = vi.mocked(getCoreTranslation);

vi.mock('@openmrs/esm-config', () => ({
  getConfig: vi.fn(),
}));

describe('PageHeaderContent', () => {
  const mockIllustration = <svg data-testid="mock-illustration" />;

  it('renders title and illustration', async () => {
    mockGetConfig.mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(screen.getByTestId('mock-illustration')).toBeInTheDocument();
  });

  it('renders implementation name when provided in config', async () => {
    mockGetCoreTranslation.mockReturnValueOnce('Test Clinic');
    mockGetConfig.mockResolvedValue({ implementationName: 'Test Clinic' });

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText('Test Clinic');
  });

  it('does not render implementation name when not provided in config', async () => {
    mockGetConfig.mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(screen.queryByText('Test Clinic')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', async () => {
    mockGetConfig.mockResolvedValue({});

    const { container } = render(
      <PageHeaderContent title="Test Title" illustration={mockIllustration} className="custom-class" />,
    );

    await screen.findByText(/test title/i);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls getConfig with correct module name', async () => {
    mockGetConfig.mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(getConfig).toHaveBeenCalledWith('@openmrs/esm-styleguide');
  });
});
