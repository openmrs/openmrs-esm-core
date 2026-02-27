import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ErrorState } from './error-state.component';

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const ServerError: Story = {
  args: {
    headerTitle: 'Vitals',
    error: {
      response: { status: 500, statusText: 'Internal Server Error' },
    },
  },
};

export const NotFound: Story = {
  args: {
    headerTitle: 'Allergies',
    error: {
      response: { status: 404, statusText: 'Not Found' },
    },
  },
};
