import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { OpenmrsDateRangePicker } from './date-range-picker.component';

const meta: Meta<typeof OpenmrsDateRangePicker> = {
  title: 'Components/DateRangePicker',
  component: OpenmrsDateRangePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OpenmrsDateRangePicker>;

export const Default: Story = {
  args: {
    labelText: 'Date range',
  },
};

export const WithDefaultValue: Story = {
  args: {
    labelText: 'Report period',
    defaultValue: [new Date(2025, 0, 1), new Date(2025, 5, 30)],
  },
};

export const Invalid: Story = {
  args: {
    labelText: 'Date range',
    invalid: true,
    invalidText: 'Please select a valid date range.',
  },
};

export const Disabled: Story = {
  args: {
    labelText: 'Date range',
    isDisabled: true,
  },
};

export const WithMinAndMaxDate: Story = {
  args: {
    labelText: 'Select dates',
    minDate: new Date(2025, 0, 1),
    maxDate: new Date(2025, 11, 31),
  },
};
