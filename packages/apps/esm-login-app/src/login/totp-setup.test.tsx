import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import { openmrsFetch, useSession } from '@openmrs/esm-framework';
import TOTPSetup from './totp-setup.component';

const mockOpenmrsFetch = jest.mocked(openmrsFetch);
const mockUseSession = jest.mocked(useSession);

describe('TOTPSetup', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      authenticated: true,
      sessionId: 'test-session-id',
      user: {
        uuid: 'user-uuid',
        display: 'Test User',
        username: 'testuser',
        systemId: 'testuser',
        person: {
          uuid: 'person-uuid',
          display: 'Test User',
          links: [],
        },
        privileges: [],
        roles: [],
        retired: false,
        userProperties: {},
        links: [],
        resourceVersion: '1.8',
        locale: 'en',
        allowedLocales: ['en'],
      },
    });
  });

  it('should render the initial setup form', () => {
    render(<TOTPSetup />);

    expect(screen.getByText(/Set up Two-Factor Authentication/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan the QR code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify and Enable/i })).toBeInTheDocument();
  });

  it('should fetch and display TOTP secret and QR code', async () => {
    const mockSecret = 'JBSWY3DPEHPK3PXP';
    const mockQrCode = 'data:image/png;base64,mock-qr-code';

    mockOpenmrsFetch.mockImplementation((url) => {
      if (url.includes('/secret')) {
        return Promise.resolve({
          data: { secret: mockSecret, qrCode: mockQrCode },
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'cors' as ResponseType,
          url: url,
          body: null,
          bodyUsed: false,
          bytes: () => Promise.resolve(new Uint8Array(0)),
          clone: () => mockOpenmrsFetch.mock.results[0].value,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({ secret: mockSecret, qrCode: mockQrCode }),
          text: () => Promise.resolve(JSON.stringify({ secret: mockSecret, qrCode: mockQrCode })),
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<TOTPSetup />);

    // Wait for secret to load
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockSecret)).toBeInTheDocument();
    });

    // Check QR code separately
    const qrCodeImage = screen.getByAltText('2FA QR Code');
    expect(qrCodeImage).toHaveAttribute('src', mockQrCode);
  });

  it('should handle TOTP verification and enablement', async () => {
    const mockSecret = 'JBSWY3DPEHPK3PXP';
    const mockQrCode = 'data:image/png;base64,mock-qr-code';
    const mockVerificationCode = '123456';

    mockOpenmrsFetch.mockImplementation((url, options) => {
      if (url.includes('/secret')) {
        return Promise.resolve({
          data: { secret: mockSecret, qrCode: mockQrCode },
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'cors' as ResponseType,
          url: url,
          body: null,
          bodyUsed: false,
          bytes: () => Promise.resolve(new Uint8Array(0)),
          clone: () => mockOpenmrsFetch.mock.results[0].value,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({ secret: mockSecret, qrCode: mockQrCode }),
          text: () => Promise.resolve(JSON.stringify({ secret: mockSecret, qrCode: mockQrCode })),
        });
      }
      if (url.includes('/validate')) {
        return Promise.resolve({
          data: { valid: true },
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'cors' as ResponseType,
          url: url,
          body: null,
          bodyUsed: false,
          bytes: () => Promise.resolve(new Uint8Array(0)),
          clone: () => mockOpenmrsFetch.mock.results[0].value,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({ valid: true }),
          text: () => Promise.resolve(JSON.stringify({ valid: true })),
        });
      }
      if (url.includes('/user/')) {
        return Promise.resolve({
          data: { userProperties: { 'authentication.secondaryType': 'totp' } },
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'cors' as ResponseType,
          url: url,
          body: null,
          bodyUsed: false,
          bytes: () => Promise.resolve(new Uint8Array(0)),
          clone: () => mockOpenmrsFetch.mock.results[0].value,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({ userProperties: { 'authentication.secondaryType': 'totp' } }),
          text: () => Promise.resolve(JSON.stringify({ userProperties: { 'authentication.secondaryType': 'totp' } })),
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const user = userEvent.setup();
    render(<TOTPSetup />);

    // Wait for secret to load
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockSecret)).toBeInTheDocument();
    });

    // Enter verification code
    await user.type(screen.getByLabelText(/Enter code from your app/i), mockVerificationCode);

    // Submit form
    await user.click(screen.getByText(/Verify and Enable/i));

    // Check success message
    await waitFor(() => {
      expect(screen.getByText(/2FA has been set up successfully/i)).toBeInTheDocument();
    });

    // Verify API calls
    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('/validate'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ secret: mockSecret, code: mockVerificationCode }),
      }),
    );

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(
      expect.stringContaining('/user/user-uuid'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('authentication.secondaryType'),
      }),
    );
  });

  it('should handle validation errors', async () => {
    const mockSecret = 'JBSWY3DPEHPK3PXP';
    const mockQrCode = 'data:image/png;base64,mock-qr-code';
    const mockVerificationCode = '123456';

    mockOpenmrsFetch.mockImplementation((url, options) => {
      if (url.includes('/secret')) {
        return Promise.resolve({
          data: { secret: mockSecret, qrCode: mockQrCode },
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'cors' as ResponseType,
          url: url,
          body: null,
          bodyUsed: false,
          bytes: () => Promise.resolve(new Uint8Array(0)),
          clone: () => mockOpenmrsFetch.mock.results[0].value,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({ secret: mockSecret, qrCode: mockQrCode }),
          text: () => Promise.resolve(JSON.stringify({ secret: mockSecret, qrCode: mockQrCode })),
        });
      }
      if (url.includes('/validate')) {
        return Promise.resolve({
          data: { valid: false },
          headers: new Headers(),
          ok: true,
          redirected: false,
          status: 200,
          statusText: 'OK',
          type: 'cors' as ResponseType,
          url: url,
          body: null,
          bodyUsed: false,
          bytes: () => Promise.resolve(new Uint8Array(0)),
          clone: () => mockOpenmrsFetch.mock.results[0].value,
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
          blob: () => Promise.resolve(new Blob()),
          formData: () => Promise.resolve(new FormData()),
          json: () => Promise.resolve({ valid: false }),
          text: () => Promise.resolve(JSON.stringify({ valid: false })),
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    const user = userEvent.setup();
    render(<TOTPSetup />);

    // Wait for secret to load
    await waitFor(() => {
      expect(screen.getByDisplayValue(mockSecret)).toBeInTheDocument();
    });

    // Enter verification code
    await user.type(screen.getByLabelText(/Enter code from your app/i), mockVerificationCode);

    // Submit form
    await user.click(screen.getByText(/Verify and Enable/i));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid code. Please try again/i)).toBeInTheDocument();
    });
  });

  it('should handle API errors', async () => {
    mockOpenmrsFetch.mockImplementation(() => {
      return Promise.reject(new Error('API Error'));
    });

    render(<TOTPSetup />);

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch TOTP secret/i)).toBeInTheDocument();
    });
  });
});
