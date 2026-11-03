import React from 'react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { navigate, useConfig } from '@openmrs/esm-framework';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TwoFactorAuthLink from './two-factor-auth-link.extension';
import type { ConfigSchema } from '../config-schema';

describe('TwoFactorAuthLink', () => {
  const mockNavigate = vi.mocked(navigate);
  const mockUseConfig = vi.mocked(useConfig);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseConfig.mockReturnValue({
      twoFactorAuth: { enabled: true },
    } as unknown as ConfigSchema);
  });

  it('should render the two factor auth link with the correct icon and text', () => {
    render(<TwoFactorAuthLink />);
    const button = screen.getByRole('button', { name: /Two-Factor Authentication/i });

    expect(button).toBeInTheDocument();
    expect(screen.getByText('TwoFactorAuthenticationIcon')).toBeInTheDocument();
  });

  it('should navigate to the two factor authentication page when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<TwoFactorAuthLink />);
    const button = screen.getByRole('button', { name: /Two-Factor Authentication/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/two-factor-auth' });
  });
});
