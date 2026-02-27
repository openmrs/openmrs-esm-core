import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDateRangePicker } from './index';

describe('OpenmrsDateRangePicker', () => {
  beforeEach(() => {
    window.i18next = { language: 'en' } as i18n;

    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-GB',
      },
    });
  });

  describe('locale and format', () => {
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
  });

  describe('labels and accessibility', () => {
    it('should work with aria-label when labelText is empty', () => {
      render(<OpenmrsDateRangePicker aria-label="Select date range" labelText="" />);
      const group = screen.getByRole('group', { name: /Select date range/i });
      expect(group).toBeInTheDocument();
      expect(screen.queryByText('Select date range')).not.toBeInTheDocument();
    });

    it('should render visible label when labelText is provided', () => {
      render(<OpenmrsDateRangePicker labelText="Date range" />);
      const labelText = screen.getByText('Date range');
      expect(labelText).toBeInTheDocument();
      expect(labelText).toHaveClass('cds--label');
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

  describe('value display', () => {
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

    it('should display prefilled date range from defaultValue prop', () => {
      render(
        <OpenmrsDateRangePicker
          aria-label="datepicker"
          defaultValue={[new Date(2024, 0, 1), new Date(2024, 11, 31)]}
        />,
      );
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('01/01/2024–31/12/2024');
    });
  });

  describe('invalid state', () => {
    it('should display invalidText when invalid is true', () => {
      render(<OpenmrsDateRangePicker aria-label="datepicker" invalid={true} invalidText="Invalid date range" />);
      expect(screen.getByText('Invalid date range')).toBeInTheDocument();
    });

    it('should not display invalidText when invalid is false', () => {
      render(<OpenmrsDateRangePicker aria-label="datepicker" invalid={false} invalidText="Invalid date range" />);
      expect(screen.queryByText('Invalid date range')).not.toBeInTheDocument();
    });

    it('should display invalidText when isInvalid is true', () => {
      render(<OpenmrsDateRangePicker aria-label="datepicker" isInvalid={true} invalidText="Bad range" />);
      expect(screen.getByText('Bad range')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should render disabled label styling when isDisabled is true', () => {
      render(<OpenmrsDateRangePicker labelText="Date range" isDisabled={true} />);
      const label = screen.getByText('Date range');
      expect(label).toHaveClass('cds--label--disabled');
    });
  });

  describe('onChange callbacks', () => {
    it('should log an error when both onChange and onChangeRaw are provided', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onChange = vi.fn();
      const onChangeRaw = vi.fn();

      render(<OpenmrsDateRangePicker aria-label="datepicker" onChange={onChange} onChangeRaw={onChangeRaw} />);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'An OpenmrsDateRangePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('calendar popover', () => {
    it('should open the calendar popover when the calendar button is clicked', async () => {
      const user = userEvent.setup();
      render(<OpenmrsDateRangePicker aria-label="datepicker" />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });
  });
});
