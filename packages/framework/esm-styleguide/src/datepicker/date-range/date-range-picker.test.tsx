import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDateRangePicker } from '../index';

describe('OpenmrsDateRangePicker', () => {
  beforeEach(() => {
    window.i18next = { language: 'en' } as i18n;

    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-GB',
      },
    });
  });

  it('uses dd/mm/yyyy for english by default', () => {
    render(<OpenmrsDateRangePicker aria-label="datepicker" />);

    const input = screen.getByLabelText('datepicker');
    expect(input).toHaveTextContent('dd/mm/yyyy–dd/mm/yyyy');
  });

  it('should respect the preferred date locale', () => {
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-US',
      },
    });
    render(<OpenmrsDateRangePicker aria-label="datepicker" />);
    const input = screen.getByLabelText('datepicker');
    expect(input).toHaveTextContent('mm/dd/yyyy–mm/dd/yyyy');
  });

  it('should render RTL layout for Arabic locale', () => {
    window.i18next = { language: 'ar' } as i18n;

    render(<OpenmrsDateRangePicker aria-label="datepicker" />);
    const input = screen.getByLabelText('datepicker');
    const text = input.textContent?.replace(/\u200F/g, '');

    expect(text).toBe('يوم/شهر/سنة–يوم/شهر/سنة');
  });

  it('should render RTL layout for Amharic locale', () => {
    window.i18next = { language: 'am' } as i18n;

    render(<OpenmrsDateRangePicker aria-label="datepicker" />);
    const input = screen.getByLabelText('datepicker');
    const text = input.textContent?.replace(/\u200F/g, '');

    expect(text).toBe('ቀቀ/ሚሜ/ዓዓዓዓ–ቀቀ/ሚሜ/ዓዓዓዓ');
  });

  it('should display prefilled date range from form value', () => {
    render(
      <OpenmrsDateRangePicker
        aria-label="datepicker"
        startName="start"
        endName="end"
        value={[new Date(2025, 2, 15), new Date(2025, 5, 18)]}
      />,
    );
    const input = screen.getByLabelText('datepicker');
    expect(input).toHaveTextContent('15/03/2025–18/06/2025');
  });

  it('should work with aria-label when labelText is empty', () => {
    render(<OpenmrsDateRangePicker aria-label="Select date range" labelText="" />);
    const group = screen.getByRole('group', { name: /Select date range/i });
    expect(group).toBeInTheDocument();
    // Should not render a visible label element
    expect(screen.queryByText('Select date range')).not.toBeInTheDocument();
  });

  it('should render visible label when labelText is provided', () => {
    render(<OpenmrsDateRangePicker labelText="Date range" />);
    // Check that the label text is visible
    const labelText = screen.getByText('Date range');
    expect(labelText).toBeInTheDocument();
    expect(labelText).toHaveClass('cds--label');
    // Check that the group exists
    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
  });

  it('should warn in development when neither labelText nor aria-label is provided', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<OpenmrsDateRangePicker labelText="" />);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'OpenmrsDateRangePicker: You must provide either a visible label (labelText/label) or an aria-label for accessibility.',
    );
    consoleWarnSpy.mockRestore();
  });
});
