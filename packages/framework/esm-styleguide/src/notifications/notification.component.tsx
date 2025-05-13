import React from 'react';
import { ActionableNotification } from '@carbon/react';
/** @module @category UI */

export interface NotificationProps {
  notification: InlineNotificationMeta;
}

export interface NotificationDescriptor {
  description: string;
  action?: string;
  kind?: InlineNotificationType;
  critical?: boolean;
  millis?: number;
  title?: string;
  onAction?: () => void;
}

export interface InlineNotificationMeta extends NotificationDescriptor {
  id: number;
}

export type InlineNotificationType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { description, action, kind, critical, title, onAction } = notification;

  return (
    <ActionableNotification
      actionButtonLabel={action}
      kind={kind || 'info'}
      lowContrast={critical}
      subtitle={description}
      title={title || ''}
      inline={true}
      onActionButtonClick={onAction}
    />
  );
};
