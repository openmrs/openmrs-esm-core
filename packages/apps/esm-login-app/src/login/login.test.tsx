
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getSessionStore,
  refetchCurrentUser,
  type SessionStore,
  useConfig,
  useConnectivity,
  useSession,
} from '@openmrs/esm-framework';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import Login from './login.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultText?: string) => {
      if (key === 'invalidCredentials') {
        return 'Invalid username or password';
      }
      return defaultText || key;
    },
  }),
}));

const mockGetSessionStore = vi.mocked(getSessionStore);
const mockLogin = vi.mocked(refetchCurrentUser);
const mockUseConfig = vi.mocked(useConfig);
const mockUseConnectivity = vi.mocked(useConnectivity);
const mockUseSession = vi.mocked(useSession);

const loginLocations = [
  { uuid: '111', display: 'Earth' },
  { uuid: '222', display: 'Mars' },
];

describe('Login', () => {
  beforeEach(() => {
    mockUseConnectivity.mockReturnValue(true);
    mockLogin.mockResolvedValue({} as SessionStore);

    mockGetSessionStore.mockImplementation(() => ({
      getState: vi.fn().mockReturnValue({
        loaded: true,
        session: {
          authenticated: true,
        },
      }),
      setState: vi.fn(),
      getInitialState: vi.fn(),
      subscribe: vi.fn(),
      destroy: vi.fn(),
    }));

    mockUseSession.mockReturnValue({ authenticated: false, sessionId: '123' });
    mockUseConfig.mockReturnValue(mockConfig);
  });

  it('renders the login form', () => {
    renderWithRouter(Login, {}, { route: '/login' });

    expect(screen.getAllByRole('img', { name: /OpenMRS logo/i })).toHaveLength(2);
    expect(screen.queryByAltText(/^logo$/i)).not.toBeInTheDocument();
    screen.getByRole('textbox', { name: /Username/i });
    screen.getByRole('button', { name: /Continue/i });
  });

  it('renders a configurable logo', () => {
    const customLogoConfig = {
      src: 'https://some-image-host.com/foo.png',
      alt: 'Custom logo',
    };

    mockUseConfig.mockReturnValue({
      ...mockConfig,
      logo: customLogoConfig,
    });

    renderWithRouter(Login);

    const logo = screen.getByAltText(customLogoConfig.alt);

    expect(screen.queryByTitle(/openmrs logo/i)).not.toBeInTheDocument();
    expect(logo).toHaveAttribute('src', customLogoConfig.src);
    expect(logo).toHaveAttribute('alt', customLogoConfig.alt);
  });

  it('should return user focus to username input when input is invalid', async () => {
    renderWithRouter(Login, {}, { route: '/login' });
    const user = userEvent.setup();

    const continueButton = screen.getByRole('button', { name: /Continue/i });

    await user.click(continueButton);
    expect(screen.getByRole('textbox', { name: /username/i })).toHaveFocus();

    await user.type(screen.getByRole('textbox', { name: /username/i }), 'yoshi');
    await user.click(continueButton);

    await screen.findByLabelText(/^password$/i);

    await user.type(screen.getByLabelText(/^password$/i), 'no-tax-fraud');
    expect(screen.getByLabelText(/^password$/i)).toHaveFocus();
  });

  it('makes an API request when you submit the form', async () => {
    mockLogin.mockResolvedValue({ some: 'data' } as unknown as SessionStore);

    renderWithRouter(Login, {}, { route: '/login' });
    const user = userEvent.setup();

    mockLogin.mockClear();

    await user.type(screen.getByRole('textbox', { name: /Username/i }), 'yoshi');
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    await screen.findByLabelText(/^password$/i);

    await user.type(screen.getByLabelText(/^password$/i), 'no-tax-fraud');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() =>
      expect(refetchCurrentUser).toHaveBeenCalledWith('yoshi', 'no-tax-fraud'),
    );
  });

  it('shows error message when invalid credentials are entered', async () => {
    mockLogin.mockResolvedValue({
      session: {
        authenticated: false,
      },
    } as unknown as SessionStore);

    renderWithRouter(Login, {}, { route: '/login' });

    const user = userEvent.setup();

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    const loginButton = screen.getByRole('button', { name: /log in/i });

    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(loginButton);

    const errorMessage = await screen.findByText(/invalid username or password/i);
    expect(errorMessage).toBeInTheDocument();
  });
});