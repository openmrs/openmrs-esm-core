import React from 'react';
import { mutate } from 'swr';
import { render, waitFor } from '@testing-library/react';
import {
  type FetchResponse,
  type Session,
  clearCurrentUser,
  navigate,
  openmrsFetch,
  refetchCurrentUser,
  restBaseUrl,
  setUserLanguage,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import RedirectLogout from './redirect-logout.component';

jest.mock('swr', () => ({
  mutate: jest.fn(),
}));

const mockClearCurrentUser = jest.mocked(clearCurrentUser);
const mockNavigate = jest.mocked(navigate);
const mockOpenmrsFetch = jest.mocked(openmrsFetch);
const mockRefetchCurrentUser = jest.mocked(refetchCurrentUser);
const mockSetUserLanguage = jest.mocked(setUserLanguage);
const mockUseConfig = jest.mocked(useConfig);
const mockUseConnectivity = jest.mocked(useConnectivity);
const mockUseSession = jest.mocked(useSession);

describe('RedirectLogout', () => {
  beforeEach(() => {
    mockUseConnectivity.mockReturnValue(true);
    mockOpenmrsFetch.mockResolvedValue({} as FetchResponse<unknown>);

    mockUseSession.mockReturnValue({
      authenticated: true,
      sessionId: 'xyz',
    } as Session);

    mockUseConfig.mockReturnValue({
      provider: {
        type: '',
      },
    });

    Object.defineProperty(document, 'documentElement', {
      configurable: true,
      value: {
        getAttribute: jest.fn().mockReturnValue('km'),
      },
    });
  });

  it('should redirect to login page upon logout', async () => {
    render(<RedirectLogout />);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${restBaseUrl}/session`, {
      method: 'DELETE',
    });

    await waitFor(() => expect(mutate).toHaveBeenCalled());

    expect(mockClearCurrentUser).toHaveBeenCalled();
    expect(mockRefetchCurrentUser).toHaveBeenCalled();
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

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${restBaseUrl}/session`, {
      method: 'DELETE',
    });

    await waitFor(() => expect(mutate).toHaveBeenCalled());

    expect(mockClearCurrentUser).toHaveBeenCalled();
    expect(mockRefetchCurrentUser).toHaveBeenCalled();
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

  it('should redirect to login if the application is offline', async () => {
    mockUseConnectivity.mockReturnValue(false);

    render(<RedirectLogout />);

    expect(mockNavigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });

  it('should handle logout failure gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOpenmrsFetch.mockRejectedValue(new Error('Logout failed'));

    render(<RedirectLogout />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Logout failed:', new Error('Logout failed'));
    });

    consoleError.mockRestore();
  });

  it('should handle missing default language attribute', async () => {
    Object.defineProperty(document, 'documentElement', {
      configurable: true,
      value: {
        getAttribute: jest.fn().mockReturnValue(null),
      },
    });

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
});
