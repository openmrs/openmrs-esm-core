import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OpenmrsDatePicker } from './index';
import { type i18n as i18nType } from 'i18next';

// Mocking the i18next object
beforeAll(() => {
  window.i18next = {
    language: 'en',
    changeLanguage: jest.fn(),
    t: jest.fn((key) => key), // Simple mock for translation function
    // Other properties and methods that might be required
    init: jest.fn(),
    getFixedT: jest.fn(),
    exists: jest.fn(),
    loadNamespaces: jest.fn(),
    loadLanguages: jest.fn(),
    use: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    dir: jest.fn(),
    cloneInstance: jest.fn(),
  } as unknown as i18nType; // Casting the mock to the correct i18n type
});

describe('OpenmrsDatePicker Component', () => {
  // Test to ensure that the component renders without crashing
  it('renders without crashing', () => {
    render(<OpenmrsDatePicker />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  // Test to verify the correct label is displayed when `labelText` prop is provided
  it('displays the correct label when labelText is provided', () => {
    render(<OpenmrsDatePicker labelText="Select Date" />);
    expect(screen.getByText('Select Date')).toBeInTheDocument();
  });

  // Test to check if the component displays the correct default value
  it('displays the correct default value', () => {
    const { container } = render(<OpenmrsDatePicker defaultValue={new Date(2024, 7, 27)} />);
    expect(container.querySelector('input')).toHaveValue('2024-08-27');
  });

  // Test to verify that the component does not crash when provided with an invalid date value
  it('does not crash with invalid dates', () => {
    render(<OpenmrsDatePicker value={null} />);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  // Test to check if the invalid text is displayed correctly when the `invalid` prop is true
  it('it shows invalid text when the text is invalid', () => {
    render(<OpenmrsDatePicker invalid={true} invalidText="Invalid Date" />);
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
  });

  // Test to verify that an error is logged when both `onChange` and `onChangeRaw` props are provided
  it('throws an error if both onChange and onChangeRaw are provided', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<OpenmrsDatePicker onChange={() => {}} onChangeRaw={() => {}} />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'An OpenmrsDatePicker component was created with both onChange and onChangeRaw handlers defined. Only onChangeRaw will be used.',
    );

    consoleErrorSpy.mockRestore();
  });

  // Test to ensure the component handles edge cases like `minDate` and `maxDate` correctly
  it('handles edge cases gracefully', () => {
    const { container } = render(<OpenmrsDatePicker minDate={new Date(2020, 0, 1)} maxDate={new Date(2020, 11, 31)} />);

    const input = container.querySelector('input');

    if (input?.hasAttribute('aria-invalid')) {
      expect(input).toHaveAttribute('aria-invalid', 'false');
    } else {
      expect(input).not.toHaveAttribute('aria-invalid');
    }
  });
});
