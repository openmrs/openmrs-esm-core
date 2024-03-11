/** @module @category UI */
import React, { useCallback } from 'react';
import { ActionableNotification } from '@carbon/react';

export interface ToastProps {
  toast: ToastNotificationMeta;
  closeToast(): void;
}

export interface ToastDescriptor {
  description: React.ReactNode;
  onActionButtonClick?: () => void;
  actionButtonLabel?: string;
  kind?: ToastType;
  critical?: boolean;
  title?: string;
}

export interface ToastNotificationMeta extends ToastDescriptor {
  id: number;
}

export type ToastType = 'error' | 'info' | 'info-square' | 'success' | 'warning' | 'warning-alt';

export const Toast: React.FC<ToastProps> = ({ toast, closeToast }) => {
  const { description, kind, critical, title, actionButtonLabel, onActionButtonClick = () => {} } = toast;
  const handleActionClick = useCallback(() => {
    onActionButtonClick();
    closeToast();
  }, [closeToast, onActionButtonClick]);

  return (
    <div>
      <ActionableNotification
        actionButtonLabel={actionButtonLabel}
        kind={kind || 'info'}
        lowContrast={critical}
        subtitle={description}
        title={title || ''}
        onActionButtonClick={handleActionClick}
        onClose={closeToast}
      />
    </div>
  );
};
