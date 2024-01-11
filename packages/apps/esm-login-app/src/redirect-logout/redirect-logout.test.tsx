import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import RedirectLogout from './redirect-logout.component';
import { performLogout } from './logout.resource';
import {
  Session,
  clearCurrentUser,
  navigate,
  openmrsFetch,
  refetchCurrentUser,
  setUserLanguage,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import { mutate } from 'swr';

jest.mock('swr', () => ({
  mutate: jest.fn(),
}));

Object.defineProperty(document, 'documentElement', {
  value: {
    getAttribute: jest.fn().mockReturnValue('km'),
  },
});

describe('Testing Logout', () => {
  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
    (useConnectivity as jest.Mock).mockReturnValue(true);
    (openmrsFetch as jest.Mock).mockResolvedValue({});
    (useSession as jest.Mock).mockReturnValue({
      authenticated: true,
      sessionId: 'xyz',
    } as Session);
    (useConfig as jest.Mock).mockReturnValue({
      provider: {
        type: '',
      },
    });
  });
  it('should render Logout and redirect to login page', async () => {
    render(<RedirectLogout />);
    expect(openmrsFetch).toHaveBeenCalledWith('/ws/rest/v1/session', {
      method: 'DELETE',
    });
    await waitFor(() => expect(mutate).toBeCalled());
    expect(clearCurrentUser).toBeCalled();
    expect(refetchCurrentUser).toBeCalled();
    expect(setUserLanguage).toHaveBeenCalledWith({
      locale: 'km',
      authenticated: false,
      sessionId: '',
    });
    expect(navigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });

  it('should render Logout and redirect to provider.logoutUrl if provider.type === oauth2', async () => {
    (useConfig as jest.Mock).mockReturnValue({
      provider: {
        type: 'oauth2',
        logoutUrl: '/oauth/logout',
      },
    });
    render(<RedirectLogout />);
    expect(openmrsFetch).toHaveBeenCalledWith('/ws/rest/v1/session', {
      method: 'DELETE',
    });
    await waitFor(() => expect(mutate).toBeCalled());
    expect(clearCurrentUser).toBeCalled();
    expect(refetchCurrentUser).toBeCalled();
    expect(setUserLanguage).toHaveBeenCalledWith({
      locale: 'km',
      authenticated: false,
      sessionId: '',
    });
    expect(navigate).toHaveBeenCalledWith({ to: '/oauth/logout' });
  });

  it('should redirect to login if the session is already unauthenticated', async () => {
    (useSession as jest.Mock).mockReturnValue({
      authenticated: false,
    } as Session);
    render(<RedirectLogout />);
    expect(navigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });

  it('should redirect to login if the application is Offline', async () => {
    (useConnectivity as jest.Mock).mockReturnValue(false);
    render(<RedirectLogout />);
    expect(navigate).toHaveBeenCalledWith({ to: '${openmrsSpaBase}/login' });
  });
});
