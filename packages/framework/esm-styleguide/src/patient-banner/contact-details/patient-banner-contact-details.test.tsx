/** @module @category UI */
import React from 'react';
import { screen } from '@testing-library/react';
import { usePatient } from '@openmrs/esm-react-utils';
import { usePatientListsForPatient } from './usePatientListsForPatient';
import { useRelationships } from './useRelationships';
import { PatientBannerContactDetails } from './patient-banner-contact-details.component';
import { renderWithSwr } from '../../test-utils';

export const nameWithFormat = {
  id: 'efdb246f-4142-4c12-a27a-9be60b9592e9',
  family: 'Wilson',
  given: ['John'],
  text: 'Wilson, John',
};

export const mockPatient = {
  resourceType: 'Patient',
  id: '8673ee4f-e2ab-4077-ba55-4980f408773e',
  extension: [
    {
      url: 'http://fhir-es.transcendinsights.com/stu3/StructureDefinition/resource-date-created',
      valueDateTime: '2017-01-18T09:42:40+00:00',
    },
    {
      url: 'https://purl.org/elab/fhir/StructureDefinition/Creator-crew-version1',
      valueString: 'daemon',
    },
  ],
  identifier: [
    {
      id: '1f0ad7a1-430f-4397-b571-59ea654a52db',
      use: 'secondary',
      system: 'Old Identification Number',
      value: '100732HE',
    },
    {
      id: '1f0ad7a1-430f-4397-b571-59ea654a52db',
      use: 'usual',
      system: 'OpenMRS ID',
      value: '100GEJ',
    },
  ],
  active: true,
  name: [nameWithFormat],
  gender: 'male',
  birthDate: '1972-04-04',
  deceasedBoolean: false,
  address: [],
  telecom: [
    {
      id: '0834e622-c816-4b95-8632-9171b3c46a76',
      value: '+243734566333',
    },
  ],
};

const mockedUsePatient = usePatient as jest.Mock;
const mockUsePatientListsForPatient = usePatientListsForPatient as jest.Mock;
const mockUseRelationships = useRelationships as jest.Mock;

const mockRelationships = [
  {
    display: '100ADT - Amanda Robinson',
    name: 'Amanda Robinson',
    relationshipType: 'Sibling',
    relativeAge: 24,
    relativeUuid: '07006bcb-91d4-4c57-a5f7-49751899d9b5',
    uuid: '993bc79d-5ca5-4c76-b4b3-adf49e25bd0b',
  },
];

const mockCohorts = [
  {
    uuid: 'fdc95682-e206-421b-9534-e2a4010cc05d',
    name: 'List three',
    startDate: '2023-04-19T23:26:27.000+0000',
    endDate: null,
  },
  {
    uuid: '1d48bec7-6aab-464c-ac16-687ba46e7812',
    name: ' Test patient List-47',
    startDate: '2023-04-24T23:28:49.000+0000',
    endDate: null,
  },
  {
    uuid: '6ce81b61-387d-43ab-86fb-606fa16d39dd',
    name: ' Test patient List-41',
    startDate: '2023-04-24T23:28:49.000+0000',
    endDate: null,
  },
  {
    uuid: '1361caf0-b3c3-4937-88e3-40074f7f3320',
    name: 'Potential Patients',
    startDate: '2023-06-07T15:40:00.000+0000',
    endDate: null,
  },
];

jest.mock('./usePatientListsForPatient', () => ({
  usePatientListsForPatient: jest.fn(),
}));

jest.mock('./useRelationships', () => ({
  useRelationships: jest.fn(),
}));

describe('ContactDetails', () => {
  beforeEach(() => {
    mockedUsePatient.mockReturnValue({
      isLoading: false,
      patient: {
        address: [
          {
            city: 'Foo',
            country: 'Bar',
            id: '0000',
            postalCode: '00100',
            state: 'Quux',
            use: 'home',
          },
        ],
        telecom: [{ system: 'Cellular', value: '+0123456789' }],
      },
    });

    mockUsePatientListsForPatient.mockReturnValue({
      isLoading: false,
      cohorts: mockCohorts,
    });

    mockUseRelationships.mockReturnValue({
      isLoading: false,
      data: mockRelationships,
    });
  });

  it("renders the patient's address, contact details, patient lists, and relationships when available", async () => {
    renderWithSwr(<PatientBannerContactDetails patient={mockPatient} deceased={false} />);

    expect(screen.getByText(/address/i)).toBeInTheDocument();
    expect(screen.getByText(/contact details/i)).toBeInTheDocument();
    expect(screen.getByText(/relationships/i)).toBeInTheDocument();
    expect(screen.getByText(/Amanda Robinson/)).toBeInTheDocument();
    expect(screen.getByText(/Sibling/i)).toBeInTheDocument();
    expect(screen.getByText(/24 yrs/i)).toBeInTheDocument();
    expect(screen.getByText(/\+243734566333/i)).toBeInTheDocument();
    expect(screen.getByText(/patient lists/i)).toBeInTheDocument();
    expect(screen.getByText(/Test patient List-47/)).toBeInTheDocument();
    expect(screen.getByText(/List three/)).toBeInTheDocument();
  });

  it('patient related name should be a link', async () => {
    renderWithSwr(<PatientBannerContactDetails patient={mockPatient} deceased={false} />);
    const relationShip = screen.getByRole('link', { name: /Amanda Robinson/ });
    expect(relationShip).toHaveAttribute('href', `/spa/patient/${mockRelationships[0].relativeUuid}/chart`);
  });

  it('renders an empty state view when contact details, relations, patient lists and addresses are not available', async () => {
    mockedUsePatient.mockReturnValue({
      isLoading: false,
      address: [],
    });
    mockUsePatientListsForPatient.mockReturnValue({
      isLoading: false,
      cohorts: [],
    });
    mockUseRelationships.mockReturnValue({
      isLoading: false,
      data: [],
    });

    renderWithSwr(<PatientBannerContactDetails patient={mockPatient} deceased={false} />);

    expect(screen.getByText(/address/i)).toBeInTheDocument();
    expect(screen.getByText(/relationships/i)).toBeInTheDocument();
    expect(screen.getByText(/contact details/i)).toBeInTheDocument();
    expect(screen.getByText(/patient lists/i)).toBeInTheDocument();
    expect(screen.getAllByText('--').length).toBe(3);
  });
});
