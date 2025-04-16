import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type i18n } from 'i18next';
import { screen, render } from '@testing-library/react';
import { usePrimaryIdentifierCode } from '@openmrs/esm-react-utils';
import { age } from '@openmrs/esm-utils';
import { PatientBannerPatientInfo } from './patient-banner-patient-info.component';

window.i18next = { language: 'en' } as i18n;
const mockUsePrimaryIdentifierCode = vi.mocked(usePrimaryIdentifierCode);

const nameWithFormat = {
  id: 'efdb246f-4142-4c12-a27a-9be60b9592e9',
  family: 'Wilson',
  given: ['John'],
  text: 'Wilson, John',
};

const mockPatient = {
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
      use: 'official',
      type: {
        coding: [{ code: '05a29f94-c0ed-11e2-94be-8c13b969e334' }],
        text: 'OpenMRS ID',
      },
      value: '100GEJ',
    },
    {
      use: 'official',
      type: {
        coding: [{ code: '4281ec43-388b-4c25-8bb2-deaff0867b2c' }],
        text: 'National ID',
      },
      value: '123456789',
    },
  ],
  active: true,
  name: [nameWithFormat],
  gender: 'male',
  birthDate: '1972-04-04',
  deceasedBoolean: false,
  address: [],
};

describe('PatientBannerPatientInfo', () => {
  beforeEach(() => {
    mockUsePrimaryIdentifierCode.mockReturnValue({
      primaryIdentifierCode: '05a29f94-c0ed-11e2-94be-8c13b969e334',
      isLoading: false,
      error: undefined,
    });
  });

  it("renders the patient's name, demographics, and identifier details in the banner", () => {
    render(<PatientBannerPatientInfo patient={mockPatient} />);

    expect(screen.getByText(/wilson, john/i)).toBeInTheDocument();
    expect(screen.getByText(/male/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(age(mockPatient.birthDate)!, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/04-Apr-1972/i)).toBeInTheDocument();
    expect(screen.getByText(/openmrs id/i)).toBeInTheDocument();
    expect(screen.getByText(/100gej/i)).toBeInTheDocument();
    expect(screen.getByText(/national id/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
  });

  it('renders the correct gender icon based on patient gender', () => {
    render(<PatientBannerPatientInfo patient={mockPatient} />);

    expect(screen.getByText('', { selector: 'use[href="#omrs-icon-gender-male"]' })).toBeInTheDocument();

    const patientWithUnknownGender = { ...mockPatient, gender: 'unknown' };

    render(<PatientBannerPatientInfo patient={patientWithUnknownGender} />);

    expect(screen.getByText('', { selector: 'use[href="#omrs-icon-gender-unknown"]' })).toBeInTheDocument();
  });
});
