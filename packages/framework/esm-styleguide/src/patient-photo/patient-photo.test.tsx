import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatientPhoto } from './patient-photo.component';
import { usePatientPhoto } from './usePatientPhoto';

const mockUsePatientPhoto = vi.mocked(usePatientPhoto);

vi.mock('./usePatientPhoto', () => ({
  usePatientPhoto: vi.fn(),
}));

vi.mock('geopattern', () => ({
  default: {
    generate: vi.fn().mockReturnValue({
      toDataUri: vi.fn().mockReturnValue('https://example.com'),
    }),
  },
}));

const patientUuid = 'test-patient-uuid';
const patientName = 'Freddy Mercury';

describe('PatientPhoto', () => {
  it('renders a progressbar when the patient photo is loading', () => {
    mockUsePatientPhoto.mockReturnValue({
      isLoading: true,
      data: null,
      error: undefined,
    });

    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders a placeholder image if the patient photo fails to load', async () => {
    mockUsePatientPhoto.mockReturnValue({
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

    mockUsePatientPhoto.mockReturnValue({
      isLoading: false,
      data: { imageSrc: 'valid-image.jpg', dateTime: '2024-01-01' },
      error: undefined,
    });

    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} />);

    // Wait for the image to "load"
    await screen.findByAltText('Profile photo unavailable - grey placeholder image');

    const avatarImage = screen.getByRole('img', { name: 'Profile photo unavailable - grey placeholder image' });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'valid-image.jpg');
    expect(avatarImage).toHaveAttribute('alt', 'Profile photo unavailable - grey placeholder image');

    // Restore the original Image constructor
    window.Image = originalImage;
  });
});
