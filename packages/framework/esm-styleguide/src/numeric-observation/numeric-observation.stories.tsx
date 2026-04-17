import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { NumericObservation } from './numeric-observation.component';

const meta: Meta<typeof NumericObservation> = {
  title: 'Components/NumericObservation',
  component: NumericObservation,
  tags: ['autodocs'],
  args: {
    patientUuid: 'test-patient-uuid',
  },
};

export default meta;
type Story = StoryObj<typeof NumericObservation>;

// -- Card variant: all interpretations --

export const CardNormal: Story = {
  args: {
    value: 120,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'NORMAL',
    variant: 'card',
  },
};

export const CardHigh: Story = {
  args: {
    value: 160,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'HIGH',
    variant: 'card',
  },
};

export const CardCriticallyHigh: Story = {
  args: {
    value: 200,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'CRITICALLY_HIGH',
    variant: 'card',
  },
};

export const CardOffScaleHigh: Story = {
  args: {
    value: 250,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'OFF_SCALE_HIGH',
    variant: 'card',
  },
};

export const CardLow: Story = {
  args: {
    value: 85,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'LOW',
    variant: 'card',
  },
};

export const CardCriticallyLow: Story = {
  args: {
    value: 60,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'CRITICALLY_LOW',
    variant: 'card',
  },
};

export const CardOffScaleLow: Story = {
  args: {
    value: 40,
    unit: 'mmHg',
    label: 'Systolic Blood Pressure',
    interpretation: 'OFF_SCALE_LOW',
    variant: 'card',
  },
};

export const CardWithoutLabel: Story = {
  args: {
    value: 120,
    unit: 'mmHg',
    interpretation: 'NORMAL',
    variant: 'card',
  },
};

export const CardNotAvailable: Story = {
  args: {
    value: '',
    label: 'Systolic Blood Pressure',
    interpretation: 'NORMAL',
    variant: 'card',
  },
};

// -- Cell variant: all interpretations --

export const CellNormal: Story = {
  args: {
    value: 98.6,
    unit: '°F',
    interpretation: 'NORMAL',
    variant: 'cell',
  },
};

export const CellHigh: Story = {
  args: {
    value: 103.2,
    unit: '°F',
    interpretation: 'HIGH',
    variant: 'cell',
  },
};

export const CellCriticallyHigh: Story = {
  args: {
    value: 107,
    unit: '°F',
    interpretation: 'CRITICALLY_HIGH',
    variant: 'cell',
  },
};

export const CellOffScaleHigh: Story = {
  args: {
    value: 110,
    unit: '°F',
    interpretation: 'OFF_SCALE_HIGH',
    variant: 'cell',
  },
};

export const CellLow: Story = {
  args: {
    value: 95.5,
    unit: '°F',
    interpretation: 'LOW',
    variant: 'cell',
  },
};

export const CellCriticallyLow: Story = {
  args: {
    value: 88,
    unit: '°F',
    interpretation: 'CRITICALLY_LOW',
    variant: 'cell',
  },
};

export const CellOffScaleLow: Story = {
  args: {
    value: 82,
    unit: '°F',
    interpretation: 'OFF_SCALE_LOW',
    variant: 'cell',
  },
};
