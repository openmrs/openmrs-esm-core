import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { navigate } from '@openmrs/esm-navigation';
import ConfigurableLinkIcon from './ConfigurableLinkIcon';
import { Events } from '@carbon/react/icons';

jest.mock('single-spa');

const mockNavigate = navigate as jest.Mock;

const testProps = {
  path: '${openmrsSpaBase}/home/appointments',
  renderIcon: Events,
  name: 'Appointments',
};

describe(`ConfigurableLinkIcon`, () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it(`interpolates the link`, async () => {
    render(<ConfigurableLinkIcon {...testProps} />);

    const link = screen.getByRole('link', { name: /Appointments/i });
    expect(link).toBeTruthy();
    expect(link.closest('a')).toHaveAttribute('href', '/openmrs/spa/home/appointments');
    const button = screen.getByLabelText('Configurable link icon');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-labelledby', 'tooltip-:r1:');
    expect(button).toHaveAttribute('type', 'button');
  
    // Trigger the click event to display the tooltip
    fireEvent.click(button);
  
    // Check if the tooltip is displayed
    const tooltipContent = screen.getByText('Link');
    expect(tooltipContent).toBeInTheDocument();
  });
});
