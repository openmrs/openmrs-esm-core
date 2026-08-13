import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { type Session, useSession } from '@openmrs/esm-framework';
import ChangeLanguageLink from './change-language-link.extension';

vi.mock('@openmrs/esm-framework', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@openmrs/esm-framework')>();
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

const mockUseSession = vi.mocked(useSession);

describe('ChangeLanguageLink', () => {
  it.each([
    ['en', /english/i],
    ['fr', /français/i],
    // The REST session reports Java `Locale#toString()` values, which `Intl` rejects outright.
    // Matched exactly: the casing within the name is part of what `getLocaleDisplayName` returns.
    ['en_US', 'American English'],
    ['sw_KE', 'Kiswahili (Kenya)'],
    ['uz@Latn', 'O‘zbek (lotin)'],
  ])('should display the current language for the %s locale', (locale, expected) => {
    mockUseSession.mockReturnValue({ authenticated: true, locale } as Session);

    render(<ChangeLanguageLink />);

    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('should fall back to English when the session has no locale', () => {
    mockUseSession.mockReturnValue({ authenticated: true } as Session);

    render(<ChangeLanguageLink />);

    expect(screen.getByText(/english/i)).toBeInTheDocument();
  });
});
