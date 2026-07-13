import React from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDatePicker } from './index';
import { DEFAULT_MIN_DATE_FLOOR } from './defaults';
import styles from './datepicker.module.scss';

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

  describe('labels and accessibility', () => {
    it('should work with aria-label when labelText is empty', () => {
      render(<OpenmrsDatePicker aria-label="Select appointment date" labelText="" />);
      const group = screen.getByRole('group', { name: /Select appointment date/i });
      expect(group).toBeInTheDocument();
      expect(screen.queryByText('Select appointment date')).not.toBeInTheDocument();
    });

    it('should render visible label when labelText is provided', () => {
      render(<OpenmrsDatePicker labelText="Appointment date" />);
      const labelText = screen.getByText('Appointment date');
      expect(labelText).toBeInTheDocument();
      expect(labelText).toHaveClass('cds--label');
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

    it('should support the deprecated label prop', () => {
      render(<OpenmrsDatePicker label="Legacy label" />);
      expect(screen.getByText('Legacy label')).toBeInTheDocument();
      expect(screen.getByText('Legacy label')).toHaveClass('cds--label');
    });

    it('should not warn when aria-labelledby is provided', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(
        <>
          <span id="my-label">External label</span>
          <OpenmrsDatePicker aria-labelledby="my-label" labelText="" />
        </>,
      );
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('value display', () => {
    it('should display a prefilled date from the value prop', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" value={new Date(2025, 2, 15)} />);
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('15/03/2025');
    });

    it('should display a prefilled date from the defaultValue prop', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" defaultValue={new Date(2025, 5, 18)} />);
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('18/06/2025');
    });

    it('should display placeholder when value is undefined', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" value={undefined} />);
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('dd/mm/yyyy');
    });

    it('should display placeholder when value is null', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" value={null} />);
      const input = screen.getByLabelText('datepicker');
      expect(input).toHaveTextContent('dd/mm/yyyy');
    });
  });

  describe('invalid state', () => {
    it('should display invalidText when invalid is true', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" invalid={true} invalidText="Date is required" />);
      expect(screen.getByText('Date is required')).toBeInTheDocument();
    });

    it('should not display invalidText when invalid is false', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" invalid={false} invalidText="Date is required" />);
      expect(screen.queryByText('Date is required')).not.toBeInTheDocument();
    });

    it('should display invalidText when isInvalid is true', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" isInvalid={true} invalidText="Bad date" />);
      expect(screen.getByText('Bad date')).toBeInTheDocument();
    });

    it('should be invalid when either invalid or isInvalid is true', () => {
      render(<OpenmrsDatePicker aria-label="datepicker" invalid={true} isInvalid={false} invalidText="Error" />);
      expect(screen.getByText('Error')).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should render disabled label styling when isDisabled is true', () => {
      render(<OpenmrsDatePicker labelText="Date" isDisabled={true} />);
      const label = screen.getByText('Date');
      expect(label).toHaveClass('cds--label--disabled');
    });

    it('should not show disabled styling when isDisabled is false', () => {
      render(<OpenmrsDatePicker labelText="Date" isDisabled={false} />);
      const label = screen.getByText('Date');
      expect(label).not.toHaveClass('cds--label--disabled');
    });
  });

  describe('onChange callbacks', () => {
    it('should log an error when both onChange and onChangeRaw are provided', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const onChange = vi.fn();
      const onChangeRaw = vi.fn();
      render(<OpenmrsDatePicker aria-label="datepicker" onChange={onChange} onChangeRaw={onChangeRaw} />);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'An OpenmrsDatePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
      );
      consoleErrorSpy.mockRestore();
    });

    it('should not log an error when only onChange is provided', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<OpenmrsDatePicker aria-label="datepicker" onChange={vi.fn()} />);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it('should not log an error when only onChangeRaw is provided', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      render(<OpenmrsDatePicker aria-label="datepicker" onChangeRaw={vi.fn()} />);
      expect(consoleErrorSpy).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('size prop', () => {
    /* eslint-disable testing-library/no-container, testing-library/no-node-access */
    it('should apply md size classes by default', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" />);
      const wrapper = container.querySelector('.cds--date-picker-input__wrapper');
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass(styles.inputWrapperMd);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonMd);
    });

    it('should apply sm size classes when size="sm"', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" size="sm" />);
      const wrapper = container.querySelector('.cds--date-picker-input__wrapper');
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass(styles.inputWrapperSm);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonSm);
    });

    it('should apply md size classes when size="md"', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" size="md" />);
      const wrapper = container.querySelector('.cds--date-picker-input__wrapper');
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass(styles.inputWrapperMd);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonMd);
    });

    it('should apply lg size classes when size="lg"', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" size="lg" />);
      const wrapper = container.querySelector('.cds--date-picker-input__wrapper');
      expect(wrapper).not.toBeNull();
      expect(wrapper).toHaveClass(styles.inputWrapperLg);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonLg);
    });
    /* eslint-enable testing-library/no-container, testing-library/no-node-access */
  });

  describe('CSS class variants', () => {
    /* eslint-disable testing-library/no-container, testing-library/no-node-access */
    it('should apply short class when short prop is true', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" short={true} />);
      const datePicker = container.querySelector('.cds--date-picker');
      expect(datePicker).not.toBeNull();
      expect(datePicker).toHaveClass('cds--date-picker--short');
    });

    it('should not apply short class when short prop is false', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" short={false} />);
      const datePicker = container.querySelector('.cds--date-picker');
      expect(datePicker).not.toBeNull();
      expect(datePicker).not.toHaveClass('cds--date-picker--short');
    });

    it('should apply light class when light prop is true', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" light={true} />);
      const datePicker = container.querySelector('.cds--date-picker');
      expect(datePicker).not.toBeNull();
      expect(datePicker).toHaveClass('cds--date-picker--light');
    });

    it('should apply custom className to the outer div', () => {
      const { container } = render(<OpenmrsDatePicker aria-label="datepicker" className="my-custom-class" />);
      const outerDiv = container.querySelector('.cds--form-item');
      expect(outerDiv).not.toBeNull();
      expect(outerDiv).toHaveClass('my-custom-class');
    });
    /* eslint-enable testing-library/no-container, testing-library/no-node-access */
  });

  describe('calendar popover', () => {
    it('should open the calendar popover when the calendar button is clicked', async () => {
      const user = userEvent.setup();
      render(<OpenmrsDatePicker aria-label="datepicker" />);
      const button = screen.getByRole('button');
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('should clamp previous-month navigation at the default minDate floor when minDate is omitted', async () => {
      const user = userEvent.setup();
      render(
        <OpenmrsDatePicker
          aria-label="datepicker"
          value={new Date(DEFAULT_MIN_DATE_FLOOR.year, DEFAULT_MIN_DATE_FLOOR.month - 1, DEFAULT_MIN_DATE_FLOOR.day)}
        />,
      );
      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const dialog = screen.getByRole('dialog');
      const previousButton = within(dialog).getByRole('button', { name: /previous/i });
      expect(previousButton).toBeInTheDocument();
      expect(previousButton).toBeDisabled();
    });

    it('should respect maxDate and disable next-month navigation at the max boundary', async () => {
      const user = userEvent.setup();
      render(
        <OpenmrsDatePicker aria-label="datepicker" value={new Date(2025, 5, 15)} maxDate={new Date(2025, 5, 30)} />,
      );
      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const dialog = screen.getByRole('dialog');
      const nextButtons = within(dialog).getAllByRole('button', { name: /next/i });
      expect(nextButtons[0]).toBeDisabled();
    });

    it('should select a date and call onChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<OpenmrsDatePicker aria-label="datepicker" defaultValue={new Date(2025, 5, 1)} onChange={onChange} />);
      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
      const dialog = screen.getByRole('dialog');
      const grid = within(dialog).getByRole('grid');
      const dayCell = within(grid).getByRole('button', { name: /15/ });
      await user.click(dayCell);
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith(new Date(2025, 5, 15));
      });
    });
  });
});
