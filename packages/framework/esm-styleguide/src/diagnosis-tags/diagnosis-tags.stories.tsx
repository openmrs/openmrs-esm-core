import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { DiagnosisTags } from './diagnosis-tags.component';

const meta: Meta<typeof DiagnosisTags> = {
  title: 'Components/DiagnosisTags',
  component: DiagnosisTags,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DiagnosisTags>;

export const PrimaryAndSecondary: Story = {
  args: {
    diagnoses: [
      { uuid: '1', display: 'Malaria', rank: 1 },
      { uuid: '2', display: 'Anemia', rank: 2 },
      { uuid: '3', display: 'Headache', rank: 2 },
    ],
  },
};

export const PrimaryOnly: Story = {
  args: {
    diagnoses: [{ uuid: '1', display: 'Hypertension', rank: 1 }],
  },
};

export const MultipleDiagnoses: Story = {
  args: {
    diagnoses: [
      { uuid: '1', display: 'Type 2 Diabetes Mellitus', rank: 1 },
      { uuid: '2', display: 'Hypertension', rank: 1 },
      { uuid: '3', display: 'Chronic Kidney Disease', rank: 2 },
      { uuid: '4', display: 'Anemia', rank: 2 },
      { uuid: '5', display: 'Neuropathy', rank: 2 },
    ],
  },
};
