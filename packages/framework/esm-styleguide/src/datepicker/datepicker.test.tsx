import React from 'react';
import type { i18n } from 'i18next';
import { render, screen } from '@testing-library/react';
import { useConfig } from '@openmrs/esm-react-utils/mock';
import { OpenmrsDatePicker } from './index';

window.i18next = { language: 'en' } as i18n;

describe('OpenmrsDatePicker', () => {
  beforeEach(() => {
    useConfig.mockReturnValue({
      preferredDateLocale: {
        en: 'en-GB',
      },
    });
  });

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
});
