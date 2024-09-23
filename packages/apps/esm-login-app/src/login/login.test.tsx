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

mockedLogin.mockReturnValue(Promise.resolve());
mockGetSessionStore.mockImplementation(() => {
  return {
    getState: jest.fn().mockReturnValue({
      session: {
        authenticated: true,
      },
    }),
  };
});

const loginLocations = [
  { uuid: '111', display: 'Earth' },
  { uuid: '222', display: 'Mars' },
];

mockedUseSession.mockReturnValue({ authenticated: false });
mockedUseConfig.mockReturnValue(mockConfig);

describe('Login', () => {
  it('renders the login form', () => {
    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );

    screen.getByRole('img', { name: /OpenMRS logo/i });
    expect(screen.queryByAltText(/logo/i)).not.toBeInTheDocument();
    screen.getByRole('textbox', { name: /Username/i });
    screen.getByRole('button', { name: /Continue/i });
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
    mockedLogin.mockReturnValue(Promise.resolve({ some: 'data' }));

    renderWithRouter(
      Login,
      {},
      {
        route: '/login',
      },
    );
    const user = userEvent.setup();

    mockedLogin.mockClear();
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
    mockedLogin.mockImplementation(() => {
      refreshUser({
        display: 'my name',
      });
      return Promise.resolve({ data: { authenticated: true } });
    });
    mockedUseSession.mockImplementation(() => {
      const [user, setUser] = useState();
      refreshUser = setUser;
      return { user, authenticated: !!user };
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
    const loginButton = screen.queryByRole('button', { name: /log in/i });

    expect(usernameInput).toBeInTheDocument();
    expect(continueButton).not.toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('should not render the password field when the showPasswordOnSeparateScreen config is true (default)', async () => {
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
    mockedLogin.mockReturnValue(Promise.resolve({ some: 'data' }));
    mockedUseConfig.mockReturnValue({
      ...mockConfig,
      showPasswordOnSeparateScreen: false,
    });
    const user = userEvent.setup();
    mockedLogin.mockClear();

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
    expect(usernameInput).toHaveFocus();
  });

  it('should focus the password input in the password screen', async () => {
    const user = userEvent.setup();
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
    const continueButton = screen.getByRole('button', { name: /Continue/i });

    await user.type(usernameInput, 'yoshi');
    await user.click(continueButton);

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveFocus();
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

    expect(usernameInput).toHaveFocus();
  });
});
