import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { PatientPhoto } from './patient-photo.component';

const meta: Meta<typeof PatientPhoto> = {
  title: 'Components/PatientPhoto',
  component: PatientPhoto,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PatientPhoto>;

export const GeneratedAvatar: Story = {
  args: {
    patientUuid: 'b5c51e24-8a4e-4b2a-bf5d-8b989f3f2c91',
    patientName: 'John Wilson',
  },
};

export const WithPhoto: Story = {
  args: {
    patientUuid: 'patient-with-photo',
    patientName: 'Maria Garcia',
  },
};
