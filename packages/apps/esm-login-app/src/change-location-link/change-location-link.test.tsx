import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { navigate, useSession } from '@openmrs/esm-framework';
import ChangeLocationLink from './change-location-link.extension';

const navigateMock = navigate as jest.Mock;
const useSessionMock = useSession as jest.Mock;

delete window.location;
window.location = new URL('https://dev3.openmrs.org/openmrs/spa/home') as unknown as Location;

describe('<ChangeLocationLink/>', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({
      sessionLocation: {
        display: 'Waffle House',
      },
    });
  });

  it('should display the `Change location` link', async () => {
    render(<ChangeLocationLink />);

    const user = userEvent.setup();
    const changeLocationButton = await screen.findByRole('button', {
      name: /Change/i,
    });

    await user.click(changeLocationButton);

    expect(navigateMock).toHaveBeenCalledWith({
      to: '${openmrsSpaBase}/login/location?returnToUrl=/openmrs/spa/home&update=true',
    });
  });
});
