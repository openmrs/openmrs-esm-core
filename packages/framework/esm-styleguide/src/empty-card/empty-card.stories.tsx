import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { EmptyCard } from './empty-card.component';

const meta: Meta<typeof EmptyCard> = {
  title: 'Components/EmptyCard',
  component: EmptyCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EmptyCard>;

export const Default: Story = {
  args: {
    headerTitle: 'Vitals',
    displayText: 'vitals',
  },
};

export const WithLaunchForm: Story = {
  args: {
    headerTitle: 'Medications',
    displayText: 'medications',
    launchForm: () => window.alert('Launch form clicked'),
  },
};
