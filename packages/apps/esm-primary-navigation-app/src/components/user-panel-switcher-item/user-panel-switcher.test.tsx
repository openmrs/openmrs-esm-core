import React from 'react';
import { screen, render } from '@testing-library/react';
import { useSession } from '@openmrs/esm-framework';
import UserPanelSwitcher from './user-panel-switcher.component';
import { mockLoggedInUser } from '../../../__mocks__/mock-user';

const mockUseSession = useSession as jest.Mock;

describe('<UserPanelSwitcher/>', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      authenticated: true,
      user: mockLoggedInUser,
    });
  });

  it('should display user name', async () => {
    render(<UserPanelSwitcher />);
    expect(await screen.findByText(/Dr Healther Morgan/i)).toBeInTheDocument();
  });
});
