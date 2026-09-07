import React from 'react';
import { beforeEach, describe, vi, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  useConfig,
  useConnectivity,
  openmrsFetch,
  type FetchResponse,
  OpenmrsFetchError,
  refetchCurrentUser,
  navigate as openmrsNavigate,
} from '@openmrs/esm-framework';
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
    refetchCurrentUser: vi.fn(),
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

    vi.mocked(useConnectivity).mockReturnValue(true);
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

  it('should append rememberMe=true to the request only when the checkbox is checked', async () => {
    vi.mocked(openmrsFetch).mockResolvedValue({
      data: { authenticated: true },
    } as unknown as FetchResponse<unknown>);

    const { user } = setup();
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

  it('should use the original referrer from sessionStorage and clear it after successful verification', async () => {
    sessionStorage.setItem('loginReferrer', '/patient-chart');
    vi.mocked(openmrsFetch).mockResolvedValue({
      data: { authenticated: true },
    } as unknown as FetchResponse<unknown>);

    vi.mocked(refetchCurrentUser).mockResolvedValue({
      session: { sessionLocation: { uuid: 'location-123', display: 'Pharmacy' } },
    } as any);

    const { user } = setup();

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');
    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);

    expect(openmrsNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/patient-chart' });
    expect(sessionStorage.getItem('loginReferrer')).toBeNull();
  });

  it('should show "Invalid verification code" error when the server returns a 401', async () => {
    const mockResponse = { status: 401 } as Response;
    const fetchError = new OpenmrsFetchError('/ws/rest/v1/session', mockResponse, null, new Error());
    vi.mocked(openmrsFetch).mockRejectedValue(fetchError);

    const { user } = setup();

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);

    const errorMessage = await screen.findByText(/Invalid verification code/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('should verify successfully and navigate to home if the user has a session location', async () => {
    vi.mocked(openmrsFetch).mockResolvedValue({
      data: { authenticated: true },
    } as unknown as FetchResponse<unknown>);

    vi.mocked(refetchCurrentUser).mockResolvedValue({
      session: { sessionLocation: { uuid: 'location-123', display: 'Pharmacy' } },
    } as any);

    const { user } = setup();

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[0]);
    await user.paste('123456');

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await user.click(verifyButton);
    expect(openmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('/ws/rest/v1/session'),
      expect.objectContaining({
        method: 'GET',
        headers: { 'X-Totp-Code': '123456' },
      }),
    );

    expect(refetchCurrentUser).toHaveBeenCalled();
    expect(openmrsNavigate).toHaveBeenCalledWith({ to: '/home' });
  });
});
