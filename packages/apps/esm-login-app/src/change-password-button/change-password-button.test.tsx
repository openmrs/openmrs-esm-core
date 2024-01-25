import React from 'react';
import ChangePasswordButton from './change-password-button.component';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { navigate } from '@openmrs/esm-framework';

const navigateMock = navigate as jest.Mock;

delete window.location;
window.location = new URL('https://dev3.openmrs.org/openmrs/spa/home') as any as Location;

describe('<ChangePasswordButton/>', () => {
  beforeEach(() => {
    render(<ChangePasswordButton />);
  });

  it('should display the `Change Password` button', async () => {
    const user = userEvent.setup();
    const changePasswordButton = await screen.findByRole('button', {
      name: /Change Password/i,
    });

    await user.click(changePasswordButton);

    expect(navigateMock).toHaveBeenCalledWith({
      to: '${openmrsSpaBase}/change-password',
    });
  });
});
