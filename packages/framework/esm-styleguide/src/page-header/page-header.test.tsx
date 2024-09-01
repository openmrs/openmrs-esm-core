import React from 'react';
import { render, screen } from '@testing-library/react';
import { getConfig } from '@openmrs/esm-config';
import { PageHeaderContent } from './page-header.component';

jest.mock('@openmrs/esm-config', () => ({
  getConfig: jest.fn(),
}));

describe('PageHeaderContent', () => {
  const mockIllustration = <svg data-testid="mock-illustration" />;

  it('renders title and illustration', async () => {
    (getConfig as jest.Mock).mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(screen.getByTestId('mock-illustration')).toBeInTheDocument();
  });

  it('renders implementation name when provided in config', async () => {
    (getConfig as jest.Mock).mockResolvedValue({ implementationName: 'Test Clinic' });

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText('Test Clinic');
  });

  it('does not render implementation name when not provided in config', async () => {
    (getConfig as jest.Mock).mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(screen.queryByText('Test Clinic')).not.toBeInTheDocument();
  });

  it('applies custom className when provided', async () => {
    (getConfig as jest.Mock).mockResolvedValue({});

    const { container } = render(
      <PageHeaderContent title="Test Title" illustration={mockIllustration} className="custom-class" />,
    );

    await screen.findByText(/test title/i);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('calls getConfig with correct module name', async () => {
    (getConfig as jest.Mock).mockResolvedValue({});

    render(<PageHeaderContent title="Test Title" illustration={mockIllustration} />);

    await screen.findByText(/test title/i);
    expect(getConfig).toHaveBeenCalledWith('@openmrs/esm-styleguide');
  });
});
