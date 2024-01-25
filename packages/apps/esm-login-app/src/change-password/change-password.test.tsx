import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig } from '@openmrs/esm-framework';
import { performPasswordChange } from './change-password.resource';
import { mockConfig } from '../../__mocks__/config.mock';
import renderWithRouter from '../test-helpers/render-with-router';
import ChangePassword from './change-password';

const mockedChangePassword = performPasswordChange as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;

jest.mock('@openmrs/esm-framework', () => {
  const originalModule = jest.requireActual('@openmrs/esm-framework');

  return {
    ...originalModule,
    clearCurrentUser: jest.fn(),
    refetchCurrentUser: jest.fn().mockReturnValue(Promise.resolve()),
    getSessionStore: jest.fn().mockImplementation(() => {
      return {
        getState: jest.fn().mockReturnValue({
          session: {
            authenticated: true,
          },
        }),
      };
    }),
    // mock only the happy path
    interpolateUrl: jest.fn().mockImplementation((url: string) => url),
  };
});

jest.mock('./change-password.resource', () => ({
  performPasswordChange: jest.fn(),
}));

mockedUseConfig.mockReturnValue(mockConfig);

describe('Change Password', () => {
  it('renders the change password form', () => {
    renderWithRouter(
      ChangePassword,
      {},
      {
        route: '/change-password',
      },
    );
    
    screen.getByLabelText(/Old Password/i);
    screen.getByLabelText(/New Password/i);
    screen.getByLabelText(/Confirm Password/i);
    screen.getByRole('button', { name: /Save/i });
  });


  it('sends the user to the login page on successful password change', async () => {
    let performLogout = () => {};
    mockedChangePassword.mockImplementation(() => {
      performLogout();
      return Promise.resolve({ data: { authenticated: true } });
    });

    renderWithRouter(
      ChangePassword,
      {},
      {
        route: '/change-password',
      },
    );

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Old Password/i), 'my-password');
    await user.type(screen.getByLabelText(/New Password/i), 'my-password');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'my-password');
    await user.click(screen.getByRole('button', { name: /Save/i }));
  });
});
