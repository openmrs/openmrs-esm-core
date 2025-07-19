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
import { LocationSelector } from './location-selector.component';

const validLocationUuid = '1ce1b7d4-c865-4178-82b0-5932e51503d6';
const inpatientWardLocationUuid = 'ba685651-ed3b-4e63-9b35-78893060758a';
const inpatientWardLocation = 'Inpatient Ward';

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
  it('renders correctly', async () => {
    await act(async () => {
      render(
        <LocationSelector
          comBoxLabel="search for a location"
          Locationlabel="Login Location"
          selectedLocationUuid={inpatientWardLocationUuid}
          onChange={vi.fn()}
        />,
      );
    });
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders a list of login locations', async () => {
    await act(async () => {
      render(
        <LocationSelector
          comBoxLabel="search for a location"
          Locationlabel="Login Location"
          selectedLocationUuid={inpatientWardLocationUuid}
          onChange={vi.fn()}
        />,
      );
    });

    expect(
      screen.getByRole('combobox', {
        name: /search for a location/i,
      }),
    ).toBeInTheDocument();

    const combo = screen.getByRole('combobox', {
      name: /search for a location/i,
    });
    await userEvent.click(combo);

    const locations = screen.getAllByRole('option');
    expect(locations.length).toBe(4);
    const expectedLocations = [/community outreach/, /inpatient ward/, /mobile clinic/, /outpatient clinic/];
    expectedLocations.forEach((row) =>
      expect(screen.getByRole('option', { name: new RegExp(row, 'i') })).toBeInTheDocument(),
    );
  });

  it('selects the provided selectedLocation when the component is rendered', async () => {
    await act(async () => {
      render(
        <LocationSelector
          comBoxLabel="search for a location"
          Locationlabel="Login Location"
          selectedLocationUuid={inpatientWardLocationUuid}
          onChange={vi.fn()}
        />,
      );
    });

    const combo = screen.getByRole('combobox', {
      name: /search for a location/i,
    });

    expect(combo).toHaveValue('Inpatient Ward');
  });

  it('loads the default location on top of the list', async () => {
    await act(async () => {
      render(
        <LocationSelector
          comBoxLabel="search for a location"
          Locationlabel="Login Location"
          selectedLocationUuid={inpatientWardLocationUuid}
          defaultLocationUuid={inpatientWardLocationUuid}
          onChange={vi.fn()}
        />,
      );
    });

    expect(
      screen.getByRole('combobox', {
        name: /search for a location/i,
      }),
    ).toBeInTheDocument();

    const combo = screen.getByRole('combobox', {
      name: /search for a location/i,
    });
    await userEvent.click(combo);

    const locations = screen.getAllByRole('option');

    expect(locations.length).toBe(4);
    locations[0].setAttribute('name', inpatientWardLocation);
    expect(locations[0].getAttribute('name')).toBe(inpatientWardLocation);
  });
});
