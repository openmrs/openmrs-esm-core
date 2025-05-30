/* eslint-disable */
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type LoggedInUser, type Session } from '@openmrs/esm-api';
import { useConfig, useSession } from '@openmrs/esm-react-utils';
import {
  inpatientWardResponse,
  locationResponseForNonExistingSearch,
  outpatientClinicResponse,
  mockLoginLocations,
} from '../../__mocks__/locations.mock';
import { mockConfig } from '../../__mocks__/config.mock';
import { LocationPicker } from './location-picker.component';

const validLocationUuid = '1ce1b7d4-c865-4178-82b0-5932e51503d6';
const inpatientWardLocationUuid = 'ba685651-ed3b-4e63-9b35-78893060758a';

const mockUseConfig = vi.mocked(useConfig);
const mockUseSession = vi.mocked(useSession);

mockUseConfig.mockReturnValue(mockConfig);
mockUseSession.mockReturnValue({
  user: {
    display: 'Testy McTesterface',
    uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
    userProperties: {},
  } as LoggedInUser,
} as Session);

vi.mock('@openmrs/esm-api', async () => ({
  ...(await import('@openmrs/esm-api')),
  openmrsFetch: vi.fn((url) => {
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
  }),
  setSessionLocation: vi.fn().mockResolvedValue({}),
  setUserProperties: vi.fn().mockResolvedValue({}),
}));

describe('LocationPicker', () => {
  it('renders a list of login locations', async () => {
    await act(async () => {
      render(<LocationPicker selectedLocationUuid={inpatientWardLocationUuid} onChange={vi.fn()} />);
    });

    expect(
      screen.getByRole('searchbox', {
        name: /search for a location/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /search for a location/i })).toBeInTheDocument();

    const locations = screen.getAllByRole('radio');
    expect(locations.length).toBe(4);
    const expectedLocations = [/community outreach/, /inpatient ward/, /mobile clinic/, /outpatient clinic/];

    expectedLocations.forEach((row) =>
      expect(screen.getByRole('radio', { name: new RegExp(row, 'i') })).toBeInTheDocument(),
    );
  });

  it('call onChange when a location is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    await act(async () => {
      render(<LocationPicker selectedLocationUuid={validLocationUuid} onChange={handleChange} />);
    });

    const location = screen.getByRole('radio', { name: /inpatient ward/i });
    await user.click(location);

    expect(handleChange).toHaveBeenCalledWith(inpatientWardLocationUuid);
  });

  it('selects the provided selectedLocation when the component is rendered', async () => {
    await act(async () => {
      render(<LocationPicker selectedLocationUuid={inpatientWardLocationUuid} onChange={vi.fn()} />);
    });
    const inpatientWardOption = screen.getByRole('radio', { name: /inpatient ward/i });
    expect(inpatientWardOption).toBeChecked();
  });

  it('loads the default location on top of the list', async () => {
    await act(async () => {
      render(<LocationPicker defaultLocationUuid={inpatientWardLocationUuid} onChange={vi.fn()} />);
    });

    const locations = screen.getAllByRole('radio');
    expect(locations.length).toBe(4);
    expect(locations[0].getAttribute('value')).toBe(inpatientWardLocationUuid);

    const expectedLocations = [/community outreach/, /inpatient ward/, /mobile clinic/, /outpatient clinic/];

    expectedLocations.forEach((location) =>
      expect(screen.getByRole('radio', { name: new RegExp(location, 'i') })).toBeInTheDocument(),
    );
  });

  it('should not display the default location if search result does not contain the default location', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<LocationPicker defaultLocationUuid={inpatientWardLocationUuid} onChange={vi.fn()} />);
    });
    const searchInput = screen.getByRole('searchbox', { name: /search for a location/i });
    await user.type(searchInput, 'outpatient');

    expect(screen.queryByRole('radio', { name: /inpatient ward/i })).not.toBeInTheDocument();
  });

  it('should display a message and should not display locations when search results are empty', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<LocationPicker defaultLocationUuid={inpatientWardLocationUuid} onChange={vi.fn()} />);
    });
    const searchInput = screen.getByRole('searchbox', { name: /search for a location/i });
    await user.type(searchInput, 'search_for_no_location');

    expect(screen.getByText(/no results to display/i)).toBeInTheDocument();
    const locations = screen.queryAllByRole('radio');
    expect(locations.length).toBe(0);
  });
});
