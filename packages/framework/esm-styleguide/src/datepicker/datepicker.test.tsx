import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDatePicker } from './index';
import { DEFAULT_MIN_DATE_FLOOR } from './defaults';

window.i18next = { language: 'en' } as i18n;

describe('OpenmrsDatePicker', () => {
  beforeEach(() => {
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-GB',
      },
    });
  });

  describe('locale and format', () => {
    it('uses dd/mm/yyyy for english by default', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" />);
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('dd/mm/yyyy');
    });

    it('should respect the preferred date locale', () => {
      useConfig.mockReturnValue({
        preferredDateLocale: {
          en: 'en-US',
        },
      });
      render(<OpenmrsDatePicker aria-label="datepicker" />);
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('mm/dd/yyyy');
    });

    it('should render RTL layout for Arabic locale', () => {
      window.i18next = { language: 'ar' } as i18n;
      useConfig.mockReturnValue({ preferredDateLocale: {} });

      render(<OpenmrsDatePicker aria-label="datepicker" />);
      const input = screen.getByLabelText('datepicker');
      const text = input.textContent?.replace(/\u200F/g, '');

      expect(text).toBe('يوم/شهر/سنة');

      window.i18next = { language: 'en' } as i18n;
    });

    it('should render RTL layout for Amharic locale', () => {
      window.i18next = { language: 'am' } as i18n;
      useConfig.mockReturnValue({ preferredDateLocale: {} });

      render(<OpenmrsDatePicker aria-label="datepicker" />);
      const input = screen.getByLabelText('datepicker');
      const text = input.textContent?.replace(/\u200F/g, '');

      expect(text).toBe('ቀቀ/ሚሜ/ዓዓዓዓ');

      window.i18next = { language: 'en' } as i18n;
    });
  });
 it('should respect the preferred date locale', () => {
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-US',
      },
    });

    render(<OpenmrsDatePicker aria-label="datepicker" />);
    const input = screen.getByLabelText('datepicker');
    expect(input).toHaveTextContent('mm/dd/yyyy');
  });
 it('should work with aria-label when labelText is empty', () => {
    render(<OpenmrsDatePicker aria-label="Select appointment date" labelText="" />);
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
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<OpenmrsDatePicker labelText="" />);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'OpenmrsDatePicker: You must provide either a visible label (labelText/label) or an aria-label for accessibility.',
    );
    consoleWarnSpy.mockRestore();
  });
it('should render disabled input when disabled prop is true', () => {
    render(<OpenmrsDatePicker aria-label="datepicker" disabled />);
    const input = screen.getByLabelText('datepicker');
    expect(input).toBeDisabled();
  });
 it('should mark input as required when required prop is true', () => {
    render(<OpenmrsDatePicker aria-label="datepicker" required />);
    const input = screen.getByLabelText('datepicker');
    expect(input).toBeRequired();
  });
});
