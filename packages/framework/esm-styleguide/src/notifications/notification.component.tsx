import React from "react";
import { InlineNotification } from "@carbon/react";
/** @module @category UI */

export interface NotificationProps {
  notification: InlineNotificationMeta;
}

export interface NotificationDescriptor {
  description: React.ReactNode;
  action?: React.ReactNode;
  kind?: InlineNotificationType;
  critical?: boolean;
  millis?: number;
  title?: string;
}

export interface InlineNotificationMeta extends NotificationDescriptor {
  id: number;
}

export type InlineNotificationType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { description, action, kind, critical, title } = notification;

  return (
    <InlineNotification
      actions={action}
      kind={kind || "info"}
      lowContrast={critical}
      subtitle={description}
      title={title || ""}
    />
  );
};
