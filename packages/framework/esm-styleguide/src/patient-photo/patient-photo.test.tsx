import React from 'react';
import { render, screen } from '@testing-library/react';
import { PatientPhoto } from './patient-photo.component';

jest.mock('./usePatientPhoto', () => ({
  usePatientPhoto: jest.fn().mockReturnValue({ data: { imageSrc: 'test-image-src' } }),
}));

jest.mock('geopattern', () => ({
  generate: jest.fn().mockReturnValue({
    toDataUri: jest.fn().mockReturnValue('https://example.com'),
  }),
}));

const patientUuid = 'test-patient-uuid';
const patientName = 'Freddy Mercury';

describe('PatientPhoto Component', () => {
  it('should render the component with the patient photo and size should not be small', () => {
    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} />);

    const avatarImage = screen.getByTitle(`${patientName}`);

    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('style', expect.stringContaining('width: 80px; height: 80px'));
  });

  it('should render the component with the patient photo and size should be small i.e. 48px', () => {
    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} size="small" />);

    const avatarImage = screen.getByTitle(`${patientName}`);

    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('style', expect.stringContaining('width: 48px; height: 48px'));
  });
});
