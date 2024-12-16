import { useState } from 'react';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSessionStore, refetchCurrentUser, type SessionStore, useConfig, useSession } from '@openmrs/esm-framework';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import Login from './login.component';

const mockGetSessionStore = jest.mocked(getSessionStore);
const mockLogin = jest.mocked(refetchCurrentUser);
const mockUseConfig = jest.mocked(useConfig);
const mockUseSession = jest.mocked(useSession);

mockLogin.mockResolvedValue({} as SessionStore);
mockGetSessionStore.mockImplementation(() => {
  return {
    getState: jest.fn().mockReturnValue({
      loaded: true,
      session: {
        authenticated: true,
      },
    }),
    setState: jest.fn(),
    getInitialState: jest.fn(),
    subscribe: jest.fn(),
    destroy: jest.fn(),
  };
});

const loginLocations = [
  { uuid: '111', display: 'Earth' },
  { uuid: '222', display: 'Mars' },
];

mockUseSession.mockReturnValue({ authenticated: false, sessionId: '123' });
mockUseConfig.mockReturnValue(mockConfig);

describe('Login', () => {
  it('renders the login form', () => {
    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

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
    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );
    const user = userEvent.setup();

    expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument();
    // no input to username
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueButton);
    expect(screen.getByRole('textbox', { name: /username/i })).toHaveFocus();
    await user.type(screen.getByRole('textbox', { name: /username/i }), 'yoshi');
    await user.click(continueButton);
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), 'no-tax-fraud');
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
  });

  it('makes an API request when you submit the form', async () => {
    mockLogin.mockResolvedValue({ some: 'data' } as unknown as SessionStore);

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );
    const user = userEvent.setup();

    mockLogin.mockClear();
    await user.type(screen.getByRole('textbox', { name: /Username/i }), 'yoshi');
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    const loginButton = screen.getByRole('button', { name: /log in/i });
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), 'no-tax-fraud');
    await user.click(loginButton);
    await waitFor(() => expect(refetchCurrentUser).toHaveBeenCalledWith('yoshi', 'no-tax-fraud'));
  });

  // TODO: Complete the test
  it('sends the user to the location select page on login if there is more than one location', async () => {
    let refreshUser = (user: any) => {};
    mockLogin.mockImplementation(() => {
      refreshUser({
        display: 'my name',
      });
      return Promise.resolve({ data: { authenticated: true } } as unknown as SessionStore);
    });
    mockUseSession.mockImplementation(() => {
      const [user, setUser] = useState();
      refreshUser = setUser;
      return { user, authenticated: !!user, sessionId: '123' };
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox', { name: /Username/i }), 'yoshi');
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByLabelText(/password/i);
    await user.type(screen.getByLabelText(/password/i), 'no-tax-fraud');
    await user.click(screen.getByRole('button', { name: /log in/i }));
  });

  it('should render the both the username and password fields when the showPasswordOnSeparateScreen config is false', async () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: false,
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.queryByRole('textbox', { name: /username/i });
    const continueButton = screen.queryByRole('button', { name: /Continue/i });
    const passwordInput = screen.queryByLabelText(/password/i);
    const loginButton = screen.queryByRole('button', { name: /log in/i });

    expect(usernameInput).toBeInTheDocument();
    expect(continueButton).not.toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('should not render the password field when the showPasswordOnSeparateScreen config is true (default)', async () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.queryByRole('textbox', { name: /username/i });
    const continueButton = screen.queryByRole('button', { name: /Continue/i });
    const passwordInput = screen.queryByLabelText(/password/i);
    const loginButton = screen.queryByRole('button', { name: /log in/i });

    expect(usernameInput).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();
    expect(passwordInput).not.toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  });

  it('should be able to login when the showPasswordOnSeparateScreen config is false', async () => {
    mockLogin.mockResolvedValue({ some: 'data' } as unknown as SessionStore);
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: false,
    });
    const user = userEvent.setup();
    mockLogin.mockClear();

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /log in/i });

    await user.type(usernameInput, 'yoshi');
    await user.type(passwordInput, 'no-tax-fraud');
    await user.click(loginButton);

    await waitFor(() => expect(refetchCurrentUser).toHaveBeenCalledWith('yoshi', 'no-tax-fraud'));
  });

  it('should focus the username input', async () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    expect(usernameInput).toHaveFocus();
  });

  it('should focus the password input in the password screen', async () => {
    const user = userEvent.setup();
    mockUseConfig.mockReturnValue({
      ...mockConfig,
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    await user.type(usernameInput, 'yoshi');
    await user.click(continueButton);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveFocus();
  });

  it('should focus the username input when the showPasswordOnSeparateScreen config is false', async () => {
    mockUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: false,
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.getByRole('textbox', { name: /username/i });

    expect(usernameInput).toHaveFocus();
  });
});
