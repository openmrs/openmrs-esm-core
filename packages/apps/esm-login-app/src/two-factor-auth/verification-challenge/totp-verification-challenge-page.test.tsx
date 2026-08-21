import React from 'react';
import { beforeEach, describe, vi, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useConfig, useConnectivity, openmrsFetch, type FetchResponse } from '@openmrs/esm-framework';
import type { ConfigSchema } from '../../config-schema';
import TotpVerificationChallengePage from './totp-verification-challenge-page.component';

vi.mock('@openmrs/esm-framework', async () => {
  const actual = await vi.importActual('@openmrs/esm-framework');
  return {
    ...actual,
    useConfig: vi.fn(),
    useConnectivity: vi.fn(),
    interpolateUrl: vi.fn(),
    openmrsFetch: vi.fn(),
  };
});

describe('TotpVerificationChallengePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useConfig).mockReturnValue({
      background: { image: '', color: '' },
      links: { loginSuccess: '/home' },
      logo: { src: '', alt: 'Logo' },
    } as unknown as ConfigSchema);

    vi.mocked(useConnectivity).mockReturnValue(true);
  });

  it('should disable the verify button when a digit is deleted after being fully filled', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TotpVerificationChallengePage />
      </MemoryRouter>,
    );

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

  it('should append rememberMe=true to the request only when the checkbox is checked', async () => {
    const user = userEvent.setup();
    vi.mocked(openmrsFetch).mockResolvedValue({
      data: { authenticated: true },
    } as unknown as FetchResponse<unknown>);

    render(
      <MemoryRouter>
        <TotpVerificationChallengePage />
      </MemoryRouter>,
    );

    const inputs = screen.getAllByRole('textbox');
    const firstInput = inputs[0];
    await user.click(firstInput);
    await user.paste('123456');

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    const rememberMeCheckbox = screen.getByLabelText(/Remember this device/i);
    await user.click(verifyButton);
    expect(openmrsFetch).toHaveBeenCalledWith(
      '/ws/rest/v1/session?rememberMe=true',
      expect.objectContaining({ method: 'GET' }),
    );

    await user.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();

    await user.click(verifyButton);
    expect(openmrsFetch).toHaveBeenCalledWith('/ws/rest/v1/session', expect.objectContaining({ method: 'GET' }));
  });
});
