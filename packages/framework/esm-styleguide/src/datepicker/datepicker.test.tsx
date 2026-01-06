import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDatePicker } from './index';

// Mock i18n language for tests
window.i18next = { language: 'en' } as i18n;

describe('OpenmrsDatePicker', () => {
  beforeEach(() => {
    // Default locale configuration for tests
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-GB',
      },
    });
  });

  it('uses dd/mm/yyyy for english by default', () => {
    // Render date picker with aria-label
    render(<OpenmrsDatePicker aria-label="datepicker" />);

    // Input should display GB-style date placeholder
    const input = screen.getByLabelText('datepicker');
    expect(input).toHaveTextContent('dd/mm/yyyy');
  });

  it('should respect the preferred date locale', () => {
    // Override locale to US format
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-US',
      },
    });

    render(<OpenmrsDatePicker aria-label="datepicker" />);

    // Input should display US-style date placeholder
    const input = screen.getByLabelText('datepicker');
    expect(input).toHaveTextContent('mm/dd/yyyy');
  });

  it('should work with aria-label when labelText is empty', () => {
    render(<OpenmrsDatePicker aria-label="Select appointment date" labelText="" />);

    // Group should be accessible via aria-label
    const group = screen.getByRole('group', { name: /Select appointment date/i });
    expect(group).toBeInTheDocument();

    // Should not render a visible label element
    expect(screen.queryByText('Select appointment date')).not.toBeInTheDocument();
  });

  it('should render visible label when labelText is provided', () => {
    render(<OpenmrsDatePicker labelText="Appointment date" />);

    // Check that the label text is visible
    const labelText = screen.getByText('Appointment date');
    expect(labelText).toBeInTheDocument();
    expect(labelText).toHaveClass('cds--label');

    // Check that the group exists
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('should warn in development when neither labelText nor aria-label is provided', () => {
    // Spy on console.warn to capture accessibility warning
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<OpenmrsDatePicker labelText="" />);

    // Expect accessibility warning to be logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'OpenmrsDatePicker: You must provide either a visible label (labelText/label) or an aria-label for accessibility.',
    );

    consoleWarnSpy.mockRestore();
  });
});
