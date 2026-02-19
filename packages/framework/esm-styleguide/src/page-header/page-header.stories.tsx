import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Button } from '@carbon/react';
import { PageHeader, PageHeaderContent } from './page-header.component';
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

export const Simple: Story = {
  args: {
    title: 'Appointments',
    illustration: <AppointmentsPictogram />,
  },
};

export const WithActions: Story = {
  render: () => (
    <PageHeader>
      <PageHeaderContent title="Appointments" illustration={<AppointmentsPictogram />} />
      <Button size="sm">New appointment</Button>
    </PageHeader>
  ),
};
