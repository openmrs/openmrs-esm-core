import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useConfig, usePrimaryIdentifierCode } from '@openmrs/esm-react-utils';
import PatientBannerPatientIdentifiers from './patient-banner-patient-identifiers.component';

const mockUsePrimaryIdentifierCode = vi.mocked(usePrimaryIdentifierCode);
const mockUseConfig = vi.mocked(useConfig);

describe('PatientBannerPatientIdentifiers', () => {
  const mockIdentifiers = [
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
  ];

  beforeEach(() => {
    mockUsePrimaryIdentifierCode.mockReturnValue({
      primaryIdentifierCode: '05a29f94-c0ed-11e2-94be-8c13b969e334',
      isLoading: false,
      error: undefined,
    });
    mockUseConfig.mockReturnValue({
      excludePatientIdentifierCodeTypes: { uuids: [] },
    });
  });

  it('renders the patient identifiers', async () => {
    render(<PatientBannerPatientIdentifiers identifiers={mockIdentifiers} showIdentifierLabel />);

    expect(screen.getByText(/openmrs id/i)).toBeInTheDocument();
    expect(screen.getByText(/100gej/i)).toBeInTheDocument();
    expect(screen.getByText(/national id/i)).toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
  });

  it('does not render identifier labels if showIdentifierLabel is false', () => {
    render(<PatientBannerPatientIdentifiers identifiers={mockIdentifiers} showIdentifierLabel={false} />);

    expect(screen.queryByText(/openmrs id/i)).not.toBeInTheDocument();
    expect(screen.getByText(/100gej/i)).toBeInTheDocument();
    expect(screen.queryByText(/national id/i)).not.toBeInTheDocument();
    expect(screen.getByText(/123456789/i)).toBeInTheDocument();
  });

  it('renders nothing if identifiers are not provided', () => {
    const { container } = render(<PatientBannerPatientIdentifiers identifiers={[]} showIdentifierLabel />);

    expect(container).toBeEmptyDOMElement();
  });

  it('filters out excluded identifier types', () => {
    mockUseConfig.mockReturnValue({
      excludePatientIdentifierCodeTypes: { uuids: ['4281ec43-388b-4c25-8bb2-deaff0867b2c'] },
    });

    render(<PatientBannerPatientIdentifiers identifiers={mockIdentifiers} showIdentifierLabel />);

    expect(screen.getByText(/openmrs id/i)).toBeInTheDocument();
    expect(screen.queryByText(/national id/i)).not.toBeInTheDocument();
  });
});
