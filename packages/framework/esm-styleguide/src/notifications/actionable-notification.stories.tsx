import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { ActionableNotificationComponent } from './actionable-notification.component';

const meta: Meta<typeof ActionableNotificationComponent> = {
  title: 'Components/ActionableNotification',
  component: ActionableNotificationComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof ActionableNotificationComponent>;

export const Default: Story = {
  args: {
    notification: {
      id: 1,
      title: 'Allergies',
      subtitle: 'No allergies have been recorded for this patient.',
      actionButtonLabel: 'Record allergies',
      onActionButtonClick: () => {},
    },
  },
};

export const WithProgressLabel: Story = {
  args: {
    notification: {
      id: 2,
      title: 'Visit ended',
      subtitle: 'The current visit has been ended.',
      actionButtonLabel: 'Undo',
      progressActionLabel: 'Undoing...',
      onActionButtonClick: () => {},
    },
  },
};

export const ErrorKind: Story = {
  args: {
    notification: {
      id: 3,
      title: 'Error',
      subtitle: 'Failed to submit the form. Please try again.',
      kind: 'error',
      actionButtonLabel: 'Retry',
      onActionButtonClick: () => {},
    },
  },
};
