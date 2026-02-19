import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { CardHeader } from './card-header.component';

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

export const WithChildren: Story = {
  args: {
    title: 'Medications',
  },
  render: (args) => (
    <CardHeader {...args}>
      <button style={{ padding: '4px 12px' }}>Add</button>
    </CardHeader>
  ),
};
