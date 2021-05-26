import React from "react";
import { InlineNotification } from "carbon-components-react/es/components/Notification";

export interface NotificationProps {
  notification: InlineNotificationMeta;
}

export interface NotificationDescriptor {
  description: React.ReactNode;
  action?: React.ReactNode;
  kind?: any;
  lowContrast?: boolean;
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
  const { description, action, kind, lowContrast, title } = notification;

  return (
    <InlineNotification
      actions={action}
      kind={kind || "info"}
      lowContrast={lowContrast ?? true}
      subtitle={description}
      title={title || ""}
    />
  );
};
