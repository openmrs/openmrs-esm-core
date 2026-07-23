import React from 'react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { showModal, useSession, useConfig } from '@openmrs/esm-framework';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import TwoFactorAuth from './two-factor-auth.component';

vi.mock('@openmrs/esm-framework', async () => {
  const actual = await vi.importActual('@openmrs/esm-framework');
  return {
    ...actual,
    showModal: vi.fn(),
    useSession: vi.fn(),
    useConfig: vi.fn(),
    PageHeader: ({ children }: any) => <header>{children}</header>,
    PageHeaderContent: ({ title }: any) => <h1>{title}</h1>,
    ServiceQueuesPictogram: () => <svg data-testid="service-queues-pictogram" />,
    MobileCheckIcon: () => <svg data-testid="mobile-check-icon" />,
  };
});

describe('Two-Factor Authentication Component', () => {
  const mockShowModal = vi.mocked(showModal);
  const mockUseSession = vi.mocked(useSession);
  const mockUseConfig = vi.mocked(useConfig);

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseConfig.mockReturnValue({
      twoFactorAuth: {
        dashboardTitle: { key: 'twoFactorAuth', value: 'Two-Factor Authentication' },
      },
    } as any);
  });

  it('should render the Setup button when TOTP is not enabled', async () => {
    mockUseSession.mockReturnValue({
      user: {
        userProperties: {
          'authentication.secondaryType': '',
        },
      },
    } as any);

    render(<TwoFactorAuth />);
    const setupButton = screen.getByRole('button', { name: /Setup/i });

    expect(setupButton).toBeInTheDocument();
    expect(screen.queryByText(/Enabled/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Remove/i })).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(setupButton);
    expect(mockShowModal).toHaveBeenCalledWith(
      'totp-enrollment-modal',
      expect.objectContaining({
        size: 'sm',
      }),
    );
  });

  it('should render the Enabled tag and Remove button when TOTP is enabled', async () => {
    mockUseSession.mockReturnValue({
      user: {
        userProperties: {
          'authentication.secondaryType': 'totp',
        },
      },
    } as any);

    render(<TwoFactorAuth />);

    expect(screen.getByText(/Enabled/i)).toBeInTheDocument();

    const removeButton = screen.getByRole('button', { name: /Remove/i });
    expect(removeButton).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Setup/i })).not.toBeInTheDocument();
  });
});
