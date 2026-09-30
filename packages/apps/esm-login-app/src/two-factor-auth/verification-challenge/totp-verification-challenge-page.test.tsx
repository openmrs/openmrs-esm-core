import React from 'react';
import { beforeEach, describe, vi, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useConfig, type Session, navigate as openmrsNavigate } from '@openmrs/esm-framework';
import { verifyTotpCode } from '@openmrs/esm-framework/src/internal';
import type { ConfigSchema } from '../../config-schema';
import TotpVerificationChallengePage from './totp-verification-challenge-page.component';

vi.mock('@openmrs/esm-framework', async () => {
  const actual = await vi.importActual('@openmrs/esm-framework');
  return {
    ...actual,
    useConfig: vi.fn(),
    interpolateUrl: vi.fn(),
    verifyTotpCode: vi.fn(),
    navigate: vi.fn(),
  };
});

describe('TotpVerificationChallengePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useConfig).mockReturnValue({
      background: { image: '', color: '' },
      links: { loginSuccess: '/home' },
      logo: { src: '', alt: 'Logo' },
      footer: { additionalLogos: [] },
    } as unknown as ConfigSchema);
  });

  const setup = () => {
    const user = userEvent.setup();
    const utils = render(
      <MemoryRouter>
        <TotpVerificationChallengePage />
      </MemoryRouter>,
    );

    return { user, ...utils };
  };

  it('should disable the verify button when a digit is deleted after being fully filled', async () => {
    const { user } = setup();

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    expect(verifyButton).toBeDisabled();

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    await user.click(firstInput);
    await user.paste('123456');
    expect(verifyButton).toBeEnabled();

    const fifthInput = inputs[4];
    await user.click(fifthInput);
    await user.keyboard('{Backspace}');
    expect(verifyButton).toBeDisabled();
  });

  it('should ask the server to remember the device only when the checkbox is checked', async () => {
    vi.mocked(verifyTotpCode).mockResolvedValue({ authenticated: true } as Session);

    const { user } = setup();
    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    await user.click(firstInput);
    await user.paste('123456');

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    const rememberMeCheckbox = screen.getByLabelText(/Remember this device/i);
    await user.click(verifyButton);
    expect(verifyTotpCode).toHaveBeenLastCalledWith('123456', true);

    await user.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();

    await user.click(verifyButton);
    expect(verifyTotpCode).toHaveBeenLastCalledWith('123456', false);
  });

  it('should use the original referrer from sessionStorage and clear it after successful verification', async () => {
    sessionStorage.setItem('loginReferrer', '/patient-chart');
    vi.mocked(verifyTotpCode).mockResolvedValue({
      authenticated: true,
      sessionLocation: { uuid: 'location-123', display: 'Pharmacy' },
    } as Session);

    const { user } = setup();

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);

    expect(openmrsNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/patient-chart' });
    expect(sessionStorage.getItem('loginReferrer')).toBeNull();
  });

  it('should verify successfully and navigate to home if the user has a session location', async () => {
    vi.mocked(verifyTotpCode).mockResolvedValue({
      authenticated: true,
      sessionLocation: { uuid: 'location-123', display: 'Pharmacy' },
    } as Session);

    const { user } = setup();

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);
    expect(verifyTotpCode).toHaveBeenCalledWith('123456', true);
    expect(openmrsNavigate).toHaveBeenCalledWith({ to: '/home' });
  });

  it('should show an error and stay on the page when the code is not accepted', async () => {
    vi.mocked(verifyTotpCode).mockResolvedValue({ authenticated: false } as Session);

    const { user } = setup();

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');
    await user.click(screen.getByRole('button', { name: /verify/i }));

    expect(screen.getByText(/We could not verify that code/i)).toBeInTheDocument();
    expect(openmrsNavigate).not.toHaveBeenCalled();
  });
});
