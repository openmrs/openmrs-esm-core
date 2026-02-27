import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Toast } from './toast.component';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    closeToast: () => {},
  },
  decorators: [
    (Story) => (
      <div className="omrs-toasts-container">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: {
    toast: {
      id: 1,
      title: 'Information',
      description: 'This is an informational message.',
      kind: 'info',
    },
  },
};

export const Success: Story = {
  args: {
    toast: {
      id: 2,
      title: 'Success',
      description: 'The operation completed successfully.',
      kind: 'success',
    },
  },
};

export const Error: Story = {
  args: {
    toast: {
      id: 3,
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      kind: 'error',
    },
  },
};

export const WithAction: Story = {
  args: {
    toast: {
      id: 4,
      title: 'Form submitted',
      description: 'The clinical form has been submitted.',
      kind: 'success',
      actionButtonLabel: 'View',
    },
  },
};
