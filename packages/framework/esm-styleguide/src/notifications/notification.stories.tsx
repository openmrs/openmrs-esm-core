import React from 'react';
import type { Meta, StoryObj } from 'storybook-react-rsbuild';
import { Notification } from './notification.component';
import { ActionableNotificationComponent } from './actionable-notification.component';

const notificationMeta: Meta<typeof Notification> = {
  title: 'Components/Notification',
  component: Notification,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default notificationMeta;
type NotificationStory = StoryObj<typeof Notification>;

export const Info: NotificationStory = {
  args: {
    notification: {
      id: 1,
      title: 'Note',
      description: 'This patient has an active visit.',
      kind: 'info',
    },
  },
};

export const Error: NotificationStory = {
  args: {
    notification: {
      id: 2,
      title: 'Error',
      description: 'Failed to load patient data.',
      kind: 'error',
    },
  },
};

export const Warning: NotificationStory = {
  args: {
    notification: {
      id: 3,
      title: 'Warning',
      description: 'This form has unsaved changes.',
      kind: 'warning',
    },
  },
};

export const WithAction: NotificationStory = {
  args: {
    notification: {
      id: 4,
      title: 'Allergies',
      description: 'No allergies have been recorded for this patient.',
      kind: 'info',
      action: 'Record allergies',
    },
  },
};
