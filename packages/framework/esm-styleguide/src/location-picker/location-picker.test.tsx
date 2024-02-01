import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { openmrsFetch, useConfig, useSession } from '@openmrs/esm-framework';
import {
  inpatientWardResponse,
  locationResponseForNonExistingSearch,
  outpatientClinicResponse,
  mockLoginLocations,
} from '../../__mocks__/locations.mock';
import { mockConfig } from '../../__mocks__/config.mock';
import { LocationPicker } from './location-picker.component';
import { expect } from '@playwright/test';

const validLocationUuid = '1ce1b7d4-c865-4178-82b0-5932e51503d6';
const inpatientWardLocationUuid = 'ba685651-ed3b-4e63-9b35-78893060758a';
const outpatientClinicLocationUuid = '44c3efb0-2583-4c80-a79e-1f756a03c0a1';

const mockedOpenmrsFetch = openmrsFetch as jest.Mock;
const mockedUseConfig = useConfig as jest.Mock;
const mockUseSession = useSession as jest.Mock;

mockedUseConfig.mockReturnValue(mockConfig);
mockUseSession.mockReturnValue({
  user: {
    display: 'Testy McTesterface',
    uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
    userProperties: {},
  },
});
mockedOpenmrsFetch.mockImplementation((url) => {
  if (url === `/ws/fhir2/R4/Location?_id=${inpatientWardLocationUuid}`) {
    return inpatientWardResponse;
  }
  if (url === '/ws/fhir2/R4/Location?_summary=data&_count=50&name%3Acontains=search_for_no_location') {
    return locationResponseForNonExistingSearch;
  }
  if (url === '/ws/fhir2/R4/Location?_summary=data&_count=50&name%3Acontains=outpatient') {
    return outpatientClinicResponse;
  }
  return mockLoginLocations;
});

jest.mock('@openmrs/esm-framework', () => ({
  ...jest.requireActual('@openmrs/esm-framework'),
  setSessionLocation: jest.fn().mockResolvedValue({}),
  setUserProperties: jest.fn().mockResolvedValue({}),
  navigate: jest.fn(),
  showToast: jest.fn(),
}));

describe('LocationPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a list of login locations', async () => {
    await act(async () => {
      render(<LocationPicker selectedLocationUuid={inpatientWardLocationUuid} onChange={jest.fn()} />);
    });

    expect(
      screen.queryByRole('searchbox', {
        name: /search for a location/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('searchbox', { name: /search for a location/i })).toBeInTheDocument();

    const locations = screen.getAllByRole('radio');
    expect(locations.length).toBe(4);
    const expectedLocations = [/community outreach/, /inpatient ward/, /mobile clinic/, /outpatient clinic/];

    expectedLocations.forEach((row) =>
      expect(screen.queryByRole('radio', { name: new RegExp(row, 'i') })).toBeInTheDocument(),
    );
  });

  it('call onChange when a location is selected', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    await act(async () => {
      render(<LocationPicker selectedLocationUuid={validLocationUuid} onChange={handleChange} />);
    });

    const location = screen.getByRole('radio', { name: /inpatient ward/i });
    await user.click(location);

    expect(handleChange).toHaveBeenCalledWith(inpatientWardLocationUuid);
  });

  it('selects the provided selectedLocation when the component is rendered', async () => {
    await act(async () => {
      render(<LocationPicker selectedLocationUuid={inpatientWardLocationUuid} onChange={jest.fn()} />);
    });
    const inpatientWardOption = screen.getByRole('radio', { name: /inpatient ward/i });
    expect(inpatientWardOption).toHaveProperty('checked', true);
  });

  it('loads the default location on top of the list', async () => {
    await act(async () => {
      render(<LocationPicker defaultLocationUuid={inpatientWardLocationUuid} onChange={jest.fn()} />);
    });

    const locations = screen.getAllByRole('radio');
    expect(locations.length).toBe(4);
    expect(locations[0].getAttribute('value')).toBe(inpatientWardLocationUuid);

    const expectedLocations = [/community outreach/, /inpatient ward/, /mobile clinic/, /outpatient clinic/];

    expectedLocations.forEach((location) =>
      expect(screen.queryByRole('radio', { name: new RegExp(location, 'i') })).toBeInTheDocument(),
    );
  });

  it('should not display the default location if search result does not contain the default location', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<LocationPicker defaultLocationUuid={inpatientWardLocationUuid} onChange={jest.fn()} />);
    });
    const searchInput = screen.getByRole('searchbox', { name: /search for a location/i });
    await user.type(searchInput, 'outpatient');

    expect(screen.queryByRole('radio', { name: /inpatient ward/i })).not.toBeInTheDocument();
  });

  it('should display a message and should not display locations when search results are empty', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<LocationPicker defaultLocationUuid={inpatientWardLocationUuid} onChange={jest.fn()} />);
    });
    const searchInput = screen.getByRole('searchbox', { name: /search for a location/i });
    await user.type(searchInput, 'search_for_no_location');

    expect(screen.queryByText(/no results to display/i)).toBeInTheDocument();
    const locations = screen.queryAllByRole('radio');
    expect(locations.length).toBe(0);
  });
});
