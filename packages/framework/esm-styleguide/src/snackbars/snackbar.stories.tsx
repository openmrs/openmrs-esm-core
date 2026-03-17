import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Snackbar } from './snackbar.component';

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  args: {
    closeSnackbar: () => {},
  },
  decorators: [
    (Story) => (
      <div className="omrs-snackbars-container">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Success: Story = {
  args: {
    snackbar: {
      id: 1,
      title: 'Patient saved',
      subtitle: 'The patient record has been updated successfully.',
      kind: 'success',
      autoClose: false,
    },
  },
};

export const Error: Story = {
  args: {
    snackbar: {
      id: 2,
      title: 'Error saving form',
      subtitle: 'An unexpected error occurred. Please try again.',
      kind: 'error',
      autoClose: false,
    },
  },
};

export const WithAction: Story = {
  args: {
    snackbar: {
      id: 3,
      title: 'Visit started',
      subtitle: 'A new visit has been started for this patient.',
      kind: 'info',
      actionButtonLabel: 'Undo',
      autoClose: false,
    },
  },
};

export const Warning: Story = {
  args: {
    snackbar: {
      id: 4,
      title: 'Connection unstable',
      subtitle: 'Some changes may not be saved.',
      kind: 'warning',
      autoClose: false,
    },
  },
};
