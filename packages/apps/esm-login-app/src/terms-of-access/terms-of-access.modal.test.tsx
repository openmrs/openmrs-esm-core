import React from 'react';
import { render, screen } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import TermsOfAccessModal from './terms-of-access.modal';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

describe('TermsOfAccessModal', () => {
  const mockT = jest.fn((key: string, fallback?: string) => fallback ?? key);

  beforeEach(() => {
    mockT.mockClear();
    (useTranslation as jest.Mock).mockReturnValue({ t: mockT });
  });

  it('uses translation keys for all copy in the modal', () => {
    render(<TermsOfAccessModal onAccepted={jest.fn()} onClose={jest.fn()} />);

    expect(mockT).toHaveBeenCalledWith('authorizedAccessOnly', 'Authorized access only');
    expect(mockT).toHaveBeenCalledWith('termsOfAccessBody1', expect.any(String));
    expect(mockT).toHaveBeenCalledWith('termsOfAccessBody2', expect.any(String));
    expect(mockT).toHaveBeenCalledWith('consentNotice', 'Consent Notice');
    expect(mockT).toHaveBeenCalledWith('termsOfAccessConsent', expect.any(String));
    expect(mockT).toHaveBeenCalledWith('agreeToTermsOfAccess', expect.any(String));
    expect(screen.getByText('Authorized access only')).toBeInTheDocument();
  });
});
