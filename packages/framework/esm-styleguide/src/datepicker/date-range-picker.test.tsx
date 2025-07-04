import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDateRangePicker } from './date-range-picker.component';

window.i18next = { language: 'en' } as i18n;

describe('OpenmrsDateRangePicker', () => {
  beforeEach(() => {
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-GB',
      },
    });
  });

  it('uses dd/mm/yyyy for english by default', () => {
    render(<OpenmrsDateRangePicker aria-label="date range picker" />);
    const startInput = screen.getByLabelText('Start date');
    const endInput = screen.getByLabelText('End date');

    expect(startInput).toHaveAttribute('placeholder', 'dd/mm/yyyy');
    expect(endInput).toHaveAttribute('placeholder', 'dd/mm/yyyy');
  });

  it('should respect the preferred date locale', () => {
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-US',
      },
    });
    render(<OpenmrsDateRangePicker aria-label="date range picker" />);
    const startInput = screen.getByLabelText('Start date');
    const endInput = screen.getByLabelText('End date');

    expect(startInput).toHaveAttribute('placeholder', 'mm/dd/yyyy');
    expect(endInput).toHaveAttribute('placeholder', 'mm/dd/yyyy');
  });

  it('renders with label and calendar button', () => {
    render(<OpenmrsDateRangePicker label="Date Range" aria-label="date range picker" />);
    const label = screen.getByText('Date Range');
    const calendarButton = screen.getByLabelText('Open calendar');

    expect(label).toBeInTheDocument();
    expect(calendarButton).toBeInTheDocument();
  });

  it('applies disabled state correctly', () => {
    render(<OpenmrsDateRangePicker label="Date Range" disabled aria-label="date range picker" />);
    const label = screen.getByText('Date Range');
    const startInput = screen.getByLabelText('Start date');
    const endInput = screen.getByLabelText('End date');

    expect(label).toHaveClass('cds--label--disabled');
    expect(startInput).toBeDisabled();
    expect(endInput).toBeDisabled();
  });

  it('displays provided date range values correctly', () => {
    const startDate = new Date('2025-07-01');
    const endDate = new Date('2025-07-15');
    render(<OpenmrsDateRangePicker value={[startDate, endDate]} aria-label="date range picker" />);

    const startInput = screen.getByLabelText('Start date');
    const endInput = screen.getByLabelText('End date');

    expect(startInput).toHaveValue('01/07/2025');
    expect(endInput).toHaveValue('15/07/2025');
  });
});
