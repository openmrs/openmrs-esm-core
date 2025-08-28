import { useState } from 'react';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSessionStore, refetchCurrentUser, useConfig, useSession } from '@openmrs/esm-framework';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import Login from './login.component';

const mockGetSessionStore = getSessionStore as jest.Mock;
const mockedLogin = refetchCurrentUser as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;
const mockedUseSession = useSession as jest.Mock;

const mockNavigate = jest.fn();
const mockOpenmrsNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@openmrs/esm-framework', () => ({
  ...jest.requireActual('@openmrs/esm-framework'),
  navigate: mockOpenmrsNavigate,
}));

mockedLogin.mockReturnValue(
  Promise.resolve({
    session: {
      authenticated: true,
      sessionLocation: { uuid: '123', display: 'Default Location' },
    },
  }),
);

mockGetSessionStore.mockImplementation(() => ({
  getState: jest.fn().mockReturnValue({
    session: {
      authenticated: true,
    },
  }),
}));

const loginLocations = [
  { uuid: '111', display: 'Earth' },
  { uuid: '222', display: 'Mars' },
];

mockedUseSession.mockReturnValue({
  authenticated: false,
  user: null,
});

mockedUseConfig.mockReturnValue(mockConfig);

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockClear();
  mockOpenmrsNavigate.mockClear();
  mockedUseSession.mockReturnValue({
    authenticated: false,
    user: null,
  });
  mockedUseConfig.mockReturnValue(mockConfig);
});

describe('Login', () => {
  it('renders the login form', () => {
    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    expect(screen.getByRole('img', { name: /OpenMRS logo/i })).toBeInTheDocument();
    expect(screen.queryByAltText(/logo/i)).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Username/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  it('renders a configurable logo', () => {
    const customLogoConfig = {
      src: 'https://some-image-host.com/foo.png',
      alt: 'Custom logo',
    };
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      logo: customLogoConfig,
    });

    renderWithRouter(Login, {}, { route: '/login' });

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

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    expect(usernameInput).toBeInTheDocument();

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueButton);
    expect(usernameInput).toHaveFocus();

    await user.type(usernameInput, 'yoshi');
    await user.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login/confirm');
    });
  });

  it('makes an API request when you submit the form', async () => {
    mockedLogin.mockResolvedValue({
      session: {
        authenticated: true,
        sessionLocation: { uuid: '123', display: 'Test Location' },
      },
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

    renderWithRouter(
      Login,
      {},
      {
        route: '/login/confirm',
      },
    );

    const passwordInput = await screen.findByLabelText(/password/i);
    await user.type(passwordInput, 'no-tax-fraud');

    const loginButton = screen.getByRole('button', { name: /log in/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(refetchCurrentUser).toHaveBeenCalledWith('yoshi', 'no-tax-fraud');
    });
  });

  it('sends the user to the location select page on login if there is no session location', async () => {
    // Mock login response without sessionLocation
    mockedLogin.mockResolvedValue({
      session: {
        authenticated: true,
        sessionLocation: null,
      },
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login/confirm',
      },
    );

    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'no-tax-fraud');

    const loginButton = screen.getByRole('button', { name: /log in/i });
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login/location');
    });
  });

  it('should render both the username and password fields when the showPasswordOnSeparateScreen config is false', async () => {
    mockedUseConfig.mockReturnValue({
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
    const loginButton = screen.queryByRole('button', { name: /sign in/i });

    expect(usernameInput).toBeInTheDocument();
    expect(continueButton).not.toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('should not render the password field when the showPasswordOnSeparateScreen config is true (default)', async () => {
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: true,
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
    const loginButton = screen.queryByRole('button', { name: /sign in/i });

    expect(usernameInput).toBeInTheDocument();
    expect(continueButton).toBeInTheDocument();
    expect(passwordInput).not.toBeInTheDocument();
    expect(loginButton).not.toBeInTheDocument();
  });

  it('should be able to login when the showPasswordOnSeparateScreen config is false', async () => {
    mockedLogin.mockResolvedValue({
      session: {
        authenticated: true,
        sessionLocation: { uuid: '123', display: 'Test Location' },
      },
    });

    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: false,
    });

    const user = userEvent.setup();

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'yoshi');
    await user.type(passwordInput, 'no-tax-fraud');
    await user.click(loginButton);

    await waitFor(() => {
      expect(refetchCurrentUser).toHaveBeenCalledWith('yoshi', 'no-tax-fraud');
    });
  });

  it('should focus the username input', async () => {
    mockedUseConfig.mockReturnValue({
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

    await waitFor(() => {
      expect(usernameInput).toHaveFocus();
    });
  });

  it('should focus the password input in the password screen', async () => {
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
    });

    renderWithRouter(
      Login,
      {},
      {
        route: '/login/confirm',
      },
    );

    const passwordInput = screen.getByLabelText(/password/i);

    // Wait for focus to be applied
    await waitFor(() => {
      expect(passwordInput).toHaveFocus();
    });
  });

  it('should focus the username input when the showPasswordOnSeparateScreen config is false', async () => {
    mockedUseConfig.mockReturnValue({
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

    await waitFor(() => {
      expect(usernameInput).toHaveFocus();
    });
  });

  it('should handle login errors gracefully', async () => {
    const errorMessage = 'Invalid credentials';
    mockedLogin.mockRejectedValue(new Error(errorMessage));

    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: false,
    });

    const user = userEvent.setup();

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    const usernameInput = screen.getByRole('textbox', { name: /username/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(usernameInput).toHaveValue('');
    expect(passwordInput).toHaveValue('');
  });
});
