/* eslint-disable */
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig, useSession, type LoggedInUser, type Session } from '@openmrs/esm-framework';
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

const mockUseConfig = jest.mocked(useConfig);
const mockUseSession = jest.mocked(useSession);

mockUseConfig.mockReturnValue(mockConfig);
mockUseSession.mockReturnValue({
  user: {
    display: 'Testy McTesterface',
    uuid: '90bd24b3-e700-46b0-a5ef-c85afdfededd',
    userProperties: {},
  } as LoggedInUser,
} as Session);

jest.mock('@openmrs/esm-framework', () => ({
  ...jest.requireActual('@openmrs/esm-framework'),
  setSessionLocation: jest.fn().mockResolvedValue({}),
  setUserProperties: jest.fn().mockResolvedValue({}),
  navigate: jest.fn(),
  showToast: jest.fn(),
  openmrsFetch: jest.fn((url) => {
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
}));

describe('LocationSelector', () => {
  //   it('renders a combo box with locations', async () => {
  //     await act(async () => {
  //       render(
  //         <LocationSelector
  //           selectedLocationUuid={inpatientWardLocationUuid}
  //           onChange={jest.fn()}
  //           Locationlabel="Select Location"
  //           comBoxLabel="Location"
  //         />,
  //       );
  //     });
  //     expect(
  //       screen.getByRole('combobox', {
  //         name: /location/i,
  //       }),
  //     ).toBeInTheDocument();
  //     expect(screen.getByText('Inpatient Ward')).toBeInTheDocument();
  //   });
  // it('calls onChange when a location is selected', async () => {
  //     const onChangeMock = jest.fn();
  //     await act(async () => {
  //         render(
  //             <LocationSelector
  //                 selectedLocationUuid={inpatientWardLocationUuid}
  //                 onChange={onChangeMock}
  //                 Locationlabel="Select Location"
  //                 comBoxLabel="Location"
  //             />
  //         );
  //     });
  //     const comboBox = screen.getByRole('combobox', { name: /location/i });
  //     await userEvent.selectOptions(comboBox, 'Inpatient Ward');
  //     expect(onChangeMock).toHaveBeenCalledWith(inpatientWardLocationUuid);
  // })
});
