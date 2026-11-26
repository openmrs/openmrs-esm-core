/** @vitest-environment jsdom */
import React, { useState } from 'react';
import type { i18n } from 'i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDateRangePicker } from './index';
import { DEFAULT_MIN_DATE_FLOOR } from './defaults';
import styles from './datepicker.module.scss';

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

  describe('size prop', () => {
    /* eslint-disable testing-library/no-node-access */
    const getInputsWrapper = (container: HTMLElement) =>
      Array.from(container.querySelectorAll('div')).find((el) => el.className.includes('inputsWrapper')) ?? null;

    it('should apply md size classes by default', () => {
      const { container } = render(<OpenmrsDateRangePicker aria-label="datepicker" />);
      const wrapper = getInputsWrapper(container)!;
      expect(wrapper).toHaveClass(styles.inputsWrapperMd);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonMd);
    });

    it('should apply sm size classes when size="sm"', () => {
      const { container } = render(<OpenmrsDateRangePicker aria-label="datepicker" size="sm" />);
      const wrapper = getInputsWrapper(container)!;
      expect(wrapper).toHaveClass(styles.inputsWrapperSm);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonSm);
    });

    it('should apply md size classes when size="md"', () => {
      const { container } = render(<OpenmrsDateRangePicker aria-label="datepicker" size="md" />);
      const wrapper = getInputsWrapper(container)!;
      expect(wrapper).toHaveClass(styles.inputsWrapperMd);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonMd);
    });

    it('should apply lg size classes when size="lg"', () => {
      const { container } = render(<OpenmrsDateRangePicker aria-label="datepicker" size="lg" />);
      const wrapper = getInputsWrapper(container)!;
      expect(wrapper).toHaveClass(styles.inputsWrapperLg);
      expect(screen.getByRole('button')).toHaveClass(styles.flatButtonLg);
    });
    /* eslint-enable testing-library/no-node-access */
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

    it('should clamp previous-month navigation at the default minDate floor when minDate is omitted', async () => {
      const user = userEvent.setup();
      render(
        <OpenmrsDateRangePicker
          aria-label="datepicker"
          value={[
            new Date(DEFAULT_MIN_DATE_FLOOR.year, DEFAULT_MIN_DATE_FLOOR.month - 1, DEFAULT_MIN_DATE_FLOOR.day),
            new Date(DEFAULT_MIN_DATE_FLOOR.year, DEFAULT_MIN_DATE_FLOOR.month - 1, DEFAULT_MIN_DATE_FLOOR.day + 1),
          ]}
        />,
      );

      await user.click(screen.getByRole('button'));

      const dialog = screen.getByRole('dialog');
      const previousButton = within(dialog).getByRole('button', { name: /previous/i });

      expect(previousButton).toBeInTheDocument();
      expect(previousButton).toBeDisabled();
    });

    it('should select a range and call onChange', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <OpenmrsDateRangePicker
          aria-label="datepicker"
          defaultValue={[new Date(2025, 5, 1), new Date(2025, 5, 2)]}
          onChange={onChange}
        />,
      );

      await user.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      const grid = within(screen.getByRole('dialog')).getByRole('grid');
      await user.click(within(grid).getByRole('button', { name: /10/ }));
      await user.click(within(grid).getByRole('button', { name: /15/ }));

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith([new Date(2025, 5, 10), new Date(2025, 5, 15)]);
      });
    });

    it('should call onChange with undefined dates when the end date is cleared', () => {
      const onChange = vi.fn();
      render(
        <OpenmrsDateRangePicker
          aria-label="datepicker"
          defaultValue={[new Date(2025, 5, 10), new Date(2025, 5, 15)]}
          onChange={onChange}
        />,
      );

      const endDateSegments = within(screen.getByLabelText('datepicker')).getAllByRole('spinbutton').slice(3);
      for (const segment of endDateSegments) {
        for (let i = 0; i < 4 && segment.getAttribute('aria-valuetext') !== 'Empty'; i++) {
          fireEvent.keyDown(segment, { key: 'Backspace' });
        }
        expect(segment).toHaveAttribute('aria-valuetext', 'Empty');
      }

      expect(onChange).toHaveBeenLastCalledWith([undefined, undefined]);
    });

    it('should let the user type a new end date after the end date is cleared', () => {
      const onChange = vi.fn();
      function ControlledDateRangePicker() {
        const [range, setRange] = useState<[Date | null, Date | null]>([new Date(2025, 5, 10), new Date(2025, 5, 15)]);
        return (
          <OpenmrsDateRangePicker
            aria-label="datepicker"
            value={range}
            onChange={(dates) => {
              onChange(dates);
              setRange([dates[0] ?? null, dates[1] ?? null]);
            }}
          />
        );
      }
      render(<ControlledDateRangePicker />);

      const getEndDateSegments = () => within(screen.getByLabelText('datepicker')).getAllByRole('spinbutton').slice(3);
      for (const segment of getEndDateSegments()) {
        for (let i = 0; i < 4 && segment.getAttribute('aria-valuetext') !== 'Empty'; i++) {
          fireEvent.keyDown(segment, { key: 'Backspace' });
        }
      }
      expect(onChange).toHaveBeenLastCalledWith([undefined, undefined]);

      const [day, month, year] = getEndDateSegments();
      const typeInto = (segment: HTMLElement, digits: string) =>
        digits
          .split('')
          .forEach((digit) =>
            fireEvent(segment, new InputEvent('beforeinput', { data: digit, inputType: 'insertText', bubbles: true })),
          );
      typeInto(day, '20');
      typeInto(month, '06');
      typeInto(year, '2025');

      expect(onChange).toHaveBeenLastCalledWith([new Date(2025, 5, 10), new Date(2025, 5, 20)]);
    });
  });

  describe('validation message', () => {
    it('should clear the validation message when the value is changed from outside', async () => {
      function ControlledDateRangePicker() {
        const [range, setRange] = useState<[Date | null, Date | null]>([new Date(2025, 5, 10), new Date(2025, 5, 15)]);
        return (
          <>
            <OpenmrsDateRangePicker
              aria-label="datepicker"
              startName="start"
              endName="end"
              maxDate={new Date(2025, 11, 31)}
              value={range}
              onChange={(dates) => setRange([dates[0] ?? null, dates[1] ?? null])}
            />
            <button onClick={() => setRange([new Date(2025, 5, 10), new Date(2025, 5, 20)])}>Set range</button>
          </>
        );
      }
      render(<ControlledDateRangePicker />);

      const [, , , endDay] = within(screen.getByLabelText('datepicker')).getAllByRole('spinbutton');
      const setRangeButton = screen.getByRole('button', { name: 'Set range' });
      act(() => endDay.focus());
      '02'
        .split('')
        .forEach((digit) =>
          fireEvent(endDay, new InputEvent('beforeinput', { data: digit, inputType: 'insertText', bubbles: true })),
        );
      expect(screen.queryByText(/start date must be before end date/i)).not.toBeInTheDocument();
      act(() => setRangeButton.focus());
      expect(screen.getByLabelText('datepicker')).toHaveTextContent('10/06/2025–02/06/2025');
      expect(await screen.findByText(/start date must be before end date/i)).toBeInTheDocument();

      fireEvent.click(setRangeButton);

      expect(screen.getByLabelText('datepicker')).toHaveTextContent('10/06/2025–20/06/2025');
      expect(screen.queryByText(/start date must be before end date/i)).not.toBeInTheDocument();
    });

    it('should clear the validation message when the starting range is restored from outside', async () => {
      function ControlledDateRangePicker() {
        const [range, setRange] = useState<[Date | null, Date | null]>([new Date(2025, 5, 10), new Date(2025, 5, 15)]);
        return (
          <>
            <OpenmrsDateRangePicker
              aria-label="datepicker"
              startName="start"
              endName="end"
              maxDate={new Date(2025, 11, 31)}
              value={range}
              onChange={(dates) => setRange([dates[0] ?? null, dates[1] ?? null])}
            />
            <button onClick={() => setRange([new Date(2025, 5, 10), new Date(2025, 5, 2)])}>Set invalid range</button>
            <button onClick={() => setRange([new Date(2025, 5, 10), new Date(2025, 5, 15)])}>Restore range</button>
          </>
        );
      }
      render(<ControlledDateRangePicker />);

      fireEvent.click(screen.getByRole('button', { name: 'Set invalid range' }));

      expect(screen.getByLabelText('datepicker')).toHaveTextContent('10/06/2025–02/06/2025');
      expect(await screen.findByText(/start date must be before end date/i)).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Restore range' }));

      expect(screen.getByLabelText('datepicker')).toHaveTextContent('10/06/2025–15/06/2025');
      expect(screen.queryByText(/start date must be before end date/i)).not.toBeInTheDocument();
    });
  });
});
