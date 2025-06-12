import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { openmrsFetch, sessionEndpoint } from '@openmrs/esm-framework';
import LoginWithTotp from './login-with-totp.component';

const mockOpenmrsFetch = jest.mocked(openmrsFetch);

describe('LoginWithTotp', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockClear();
  });

  it('should render the TOTP login form', () => {
    render(<LoginWithTotp />);

    expect(screen.getByText(/MFA Code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify/i })).toBeInTheDocument();
  });

  it('should handle successful TOTP verification', async () => {
    const mockTotpCode = '123456';
    const mockResponse = {
      data: {
        authenticated: true,
        sessionLocation: { uuid: 'location-uuid' },
      },
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'cors' as ResponseType,
      url: sessionEndpoint,
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array(0)),
      clone: () => mockResponse,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: () => Promise.resolve(mockResponse.data),
      text: () => Promise.resolve(JSON.stringify(mockResponse.data)),
    };
    mockOpenmrsFetch.mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    render(<LoginWithTotp />);

    // Enter TOTP code
    await user.type(screen.getByLabelText(/MFA Code/i), mockTotpCode);

    // Submit form
    await user.click(screen.getByRole('button', { name: /Verify/i }));

    // Verify API call
    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining(sessionEndpoint),
      expect.objectContaining({
        method: 'POST',
        body: {
          redirect: '/openmrs/spa/home',
        },
      }),
    );

    // Check URL parameters
    const url = mockOpenmrsFetch.mock.calls[0][0];
    expect(url).toContain(`code=${mockTotpCode}`);
  });

  it('should handle failed TOTP verification', async () => {
    const mockTotpCode = '123456';
    const mockResponse = {
      data: {
        authenticated: false,
      },
      headers: new Headers(),
      ok: true,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'cors' as ResponseType,
      url: sessionEndpoint,
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array(0)),
      clone: () => mockResponse,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: () => Promise.resolve(mockResponse.data),
      text: () => Promise.resolve(JSON.stringify(mockResponse.data)),
    };
    mockOpenmrsFetch.mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    render(<LoginWithTotp />);

    // Enter TOTP code
    await user.type(screen.getByLabelText(/MFA Code/i), mockTotpCode);

    // Submit form
    await user.click(screen.getByRole('button', { name: /Verify/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid MFA code/i)).toBeInTheDocument();
    });

    // Verify input is cleared
    expect(screen.getByLabelText(/MFA Code/i)).toHaveValue('');
  });

  it('should handle API errors', async () => {
    const mockTotpCode = '123456';
    mockOpenmrsFetch.mockRejectedValue(new Error('API Error'));

    const user = userEvent.setup();
    render(<LoginWithTotp />);

    // Enter TOTP code
    await user.type(screen.getByLabelText(/MFA Code/i), mockTotpCode);

    // Submit form
    await user.click(screen.getByRole('button', { name: /Verify/i }));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to verify MFA code/i)).toBeInTheDocument();
    });

    // Verify input is cleared
    expect(screen.getByLabelText(/MFA Code/i)).toHaveValue('');
  });

  it('should show loading state during verification', async () => {
    const mockTotpCode = '123456';
    mockOpenmrsFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    const user = userEvent.setup();
    render(<LoginWithTotp />);

    // Enter TOTP code
    await user.type(screen.getByLabelText(/MFA Code/i), mockTotpCode);

    // Submit form
    await user.click(screen.getByRole('button', { name: /Verify/i }));

    // Check loading state
    expect(screen.getByText(/Verifying/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
