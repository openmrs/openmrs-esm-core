import React from 'react';
import { Button } from '@carbon/react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { CardHeader } from './card-header.component';
import { AddIcon } from '../icons';

const meta: Meta<typeof CardHeader> = {
  title: 'Components/CardHeader',
  component: CardHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CardHeader>;

export const Default: Story = {
  args: {
    title: 'Vitals',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Medications',
  },
  render: (args) => (
    <CardHeader {...args}>
      <Button kind="ghost" renderIcon={AddIcon} iconDescription="Add Medication">
        Add
      </Button>
    </CardHeader>
  ),
};
