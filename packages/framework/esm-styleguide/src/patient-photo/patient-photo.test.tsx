import React from 'react';
import { render, screen } from '@testing-library/react';
import { PatientPhoto } from './patient-photo.component';
import { usePatientPhoto } from './usePatientPhoto';

const mockedUsePatientPhoto = jest.mocked(usePatientPhoto);

jest.mock('./usePatientPhoto', () => ({
  usePatientPhoto: jest.fn(),
}));

jest.mock('geopattern', () => ({
  generate: jest.fn().mockReturnValue({
    toDataUri: jest.fn().mockReturnValue('https://example.com'),
  }),
}));

const patientUuid = 'test-patient-uuid';
const patientName = 'Freddy Mercury';

describe('PatientPhoto', () => {
  it('renders a progressbar when the patient photo is loading', () => {
    mockedUsePatientPhoto.mockReturnValue({
      isLoading: true,
      data: null,
      error: undefined,
    });

    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders a placeholder image if the patient photo fails to load', async () => {
    mockedUsePatientPhoto.mockReturnValue({
      isLoading: false,
      data: { imageSrc: 'invalid-url.jpg', dateTime: '2024-01-01' },
      error: undefined,
    });

    render(<PatientPhoto patientName={patientName} patientUuid={patientUuid} />);

    expect(screen.getByLabelText(/patient photo placeholder/i)).toBeInTheDocument();
  });

  it('renders the avatar image when image successfully loads', async () => {
    // Mock the Image loading process
    const originalImage = window.Image;
    const mockImage = function () {
      return {
        onload: null,
        _src: '',
        get src() {
          return this._src;
        },
        set src(value: string) {
          this._src = value;
          // Simulate successful image load
          setTimeout(() => {
            if (this.onload) {
              this.onload.call(this, new Event('load'));
            }
          }, 0);
        },
      };
    };
    window.Image = mockImage as any;

    mockedUsePatientPhoto.mockReturnValue({
      isLoading: false,
      data: { imageSrc: 'valid-image.jpg', dateTime: '2024-01-01' },
      error: undefined,
    });

    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} />);

    // Wait for the image to "load"
    await screen.findByAltText(`${patientName}'s avatar`);

    const avatarImage = screen.getByRole('img', { name: `${patientName}'s avatar` });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'valid-image.jpg');
    expect(avatarImage).toHaveAttribute('alt', `${patientName}'s avatar`);

    // Restore the original Image constructor
    window.Image = originalImage;
  });
});
