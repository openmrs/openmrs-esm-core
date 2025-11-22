import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PatientPhoto } from './patient-photo.component';
import { usePatientPhoto } from './usePatientPhoto';

const mockUsePatientPhoto = vi.mocked(usePatientPhoto);

vi.mock('./usePatientPhoto', () => ({
  usePatientPhoto: vi.fn(),
}));

const mockToDataUrl = vi.fn().mockReturnValue('data:image/svg+xml;base64,mockpattern');

vi.mock('geopattern', () => ({
  default: {
    generate: vi.fn(() => ({
      toDataUrl: mockToDataUrl,
    })),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, defaultValue: string, options?: any) => {
      if (options && options.patientName) {
        return defaultValue.replace('{{patientName}}', options.patientName);
      }
      return defaultValue;
    },
  }),
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

    expect(screen.getByTestId('skeleton-icon')).toBeInTheDocument();
  });

  it('renders a placeholder image if the patient photo fails to load', async () => {
    // Mock the Image loading process to simulate a failed load
    const originalImage = window.Image;
    const mockImage = function () {
      return {
        onerror: null,
        _src: '',
        get src() {
          return this._src;
        },
        set src(value: string) {
          this._src = value;
          // Simulate failed image load
          setTimeout(() => {
            if (this.onerror) {
              this.onerror.call(this, new Event('error'));
            }
          }, 0);
        },
      };
    };
    window.Image = mockImage as any;

    mockUsePatientPhoto.mockReturnValue({
      isLoading: false,
      data: { imageSrc: 'invalid-url.jpg', dateTime: '2024-01-01' },
      error: undefined,
    });

    render(<PatientPhoto patientName={patientName} patientUuid={patientUuid} />);

    // Wait for the placeholder to appear after image validation fails
    await screen.findByLabelText('Photo placeholder for Freddy Mercury');

    expect(screen.getByLabelText('Photo placeholder for Freddy Mercury')).toBeInTheDocument();

    // Restore the original Image constructor
    window.Image = originalImage;
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
    await screen.findByAltText('Profile photo of Freddy Mercury');

    const avatarImage = screen.getByRole('img', { name: 'Profile photo of Freddy Mercury' });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', 'valid-image.jpg');
    expect(avatarImage).toHaveAttribute('alt', 'Profile photo of Freddy Mercury');

    // Restore the original Image constructor
    window.Image = originalImage;
  });

  it('renders avatar with GeoPattern background when no photo is available', () => {
    mockUsePatientPhoto.mockReturnValue({
      isLoading: false,
      data: null,
      error: undefined,
    });

    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} />);

    // When no photo is available, the Avatar component renders initials as a div, not an img
    const avatar = screen.getByTitle('Freddy Mercury');
    expect(avatar).toBeInTheDocument();
  });

  it('uses custom alt text when provided with a valid image', async () => {
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

    const customAlt = 'Custom patient image';
    render(<PatientPhoto patientUuid={patientUuid} patientName={patientName} alt={customAlt} />);

    await screen.findByAltText(customAlt);

    const avatarImage = screen.getByRole('img', { name: customAlt });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('alt', customAlt);

    // Restore the original Image constructor
    window.Image = originalImage;
  });
});
