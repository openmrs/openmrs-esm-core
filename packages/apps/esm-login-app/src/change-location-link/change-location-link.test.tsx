import React from 'react';
import ChangeLocationLink from './change-location-link.component';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { navigate } from '@openmrs/esm-framework';

const navigateMock = navigate as jest.Mock;

describe('<ChangeLocationLink/>', () => {
  const mockChangeLocationProps = {
    referer: '/openmrs/spa/home',
    currentLocation: 'Unknown Location',
  };

  beforeEach(() => {
    render(
      <ChangeLocationLink
        referer={mockChangeLocationProps.referer}
        currentLocation={mockChangeLocationProps.currentLocation}
      />,
    );
  });

  it('should display the `Change location` link', async () => {
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
