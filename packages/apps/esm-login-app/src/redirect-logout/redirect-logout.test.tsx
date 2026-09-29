import React from 'react';
import { mutate } from 'swr';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { type Session, navigate, setUserLanguage, useConfig, useSession } from '@openmrs/esm-framework';
import { logout } from '@openmrs/esm-framework/src/internal';
import RedirectLogout from './redirect-logout.component';

vi.mock('swr', () => ({
  mutate: vi.fn(),
}));

const mockLogout = vi.mocked(logout);
const mockNavigate = vi.mocked(navigate);
const mockSetUserLanguage = vi.mocked(setUserLanguage);
const mockUseConfig = vi.mocked(useConfig);
const mockUseSession = vi.mocked(useSession);

describe('RedirectLogout', () => {
  beforeEach(() => {
    mockLogout.mockResolvedValue(undefined);

    mockUseSession.mockReturnValue({
      authenticated: true,
      sessionId: 'xyz',
    } as Session);

    mockUseConfig.mockReturnValue({
      provider: {
        type: 'basic',
      },
    });

    vi.spyOn(document.documentElement, 'getAttribute').mockReturnValue('km');
  });

  it('should redirect to login page upon logout', async () => {
    render(<RedirectLogout />);

    expect(mockLogout).toHaveBeenCalled();

    await waitFor(() => expect(mutate).toHaveBeenCalled());

    expect(mockSetUserLanguage).toHaveBeenCalledWith({
      locale: 'km',
      authenticated: false,
      sessionId: '',
    });
    expect(mockNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });

  it('should not redirect if the configured provider is `oauth2`', async () => {
    mockUseConfig.mockReturnValue({
      provider: {
        type: 'oauth2',
      },
    });

    render(<RedirectLogout />);

    expect(mockLogout).toHaveBeenCalled();

    await waitFor(() => expect(mutate).toHaveBeenCalled());

    expect(mockSetUserLanguage).toHaveBeenCalledWith({
      locale: 'km',
      authenticated: false,
      sessionId: '',
    });
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('should redirect to login if the session is already unauthenticated', async () => {
    mockUseSession.mockReturnValue({
      authenticated: false,
    } as Session);

    render(<RedirectLogout />);

    expect(mockNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });

  it('should handle logout failure gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLogout.mockRejectedValue(new Error('Logout failed'));

    render(<RedirectLogout />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Logout failed:', new Error('Logout failed'));
    });

    consoleError.mockRestore();
  });

  it('should handle missing default language attribute', async () => {
    vi.spyOn(document.documentElement, 'getAttribute').mockReturnValue(null);

    render(<RedirectLogout />);

    await waitFor(() => {
      expect(mockSetUserLanguage).toHaveBeenCalledWith({
        locale: null,
        authenticated: false,
        sessionId: '',
      });
    });
  });

  it('should handle config changes appropriately', async () => {
    const { rerender } = render(<RedirectLogout />);

    mockUseConfig.mockReturnValue({
      provider: {
        type: 'testProvider',
      },
    });

    rerender(<RedirectLogout />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
    });
  });

  it('should not redirect to login if user is not authenticated and the provider is oauth2', async () => {
    mockUseSession.mockReturnValue({
      authenticated: false,
    } as Session);
    mockUseConfig.mockReturnValue({
      provider: {
        type: 'oauth2',
      },
    });

    render(<RedirectLogout />);

    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('should redirect to login if user is not authenticated and the provider is custom', async () => {
    mockUseSession.mockReturnValue({
      authenticated: false,
    } as Session);
    mockUseConfig.mockReturnValue({
      provider: {
        type: 'custom',
        loginUrl: 'http://custom-url.com',
      },
    });

    render(<RedirectLogout />);

    expect(mockNavigate).toHaveBeenCalledWith({ to: 'http://custom-url.com' });
  });

  it('should redirect to login if user is authenticated and the provider is custom', async () => {
    mockUseSession.mockReturnValue({
      authenticated: true,
    } as Session);
    mockUseConfig.mockReturnValue({
      provider: {
        type: 'custom',
        loginUrl: 'https://custom-url.com',
      },
    });

    render(<RedirectLogout />);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith({ to: 'https://custom-url.com' }));
  });
});
