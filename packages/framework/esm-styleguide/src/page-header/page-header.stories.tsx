import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { PageHeader } from './page-header.component';
import { AppointmentsPictogram } from '../pictograms/pictograms';

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Appointments',
    illustration: <AppointmentsPictogram />,
  },
};
