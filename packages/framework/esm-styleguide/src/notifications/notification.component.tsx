import React from "react";
import { InlineNotification } from "carbon-components-react/es/components/Notification";

const defaultOptions = {
  millis: 4000,
};

export interface NotificationProps {
  notification: InlineNotificationMeta;
  closeNotification(): void;
}

export interface NotificationDescriptor {
  description: React.ReactNode;
  action?: React.ReactNode;
  kind?: any;
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

export const Notification: React.FC<NotificationProps> = ({
  notification,
  closeNotification,
}) => {
  const {
    description,
    action,
    kind,
    millis = defaultOptions.millis,
    title,
  } = notification;
  const [waitingForTime, setWaitingForTime] = React.useState(true);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(closeNotification, millis);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingForTime]);

  return (
    <div
      onMouseEnter={() => setWaitingForTime(false)}
      onMouseLeave={() => setWaitingForTime(true)}
    >
      <InlineNotification
        lowContrast
        actions={action}
        kind={kind || "info"}
        subtitle={description}
        title={title || ""}
      />
    </div>
  );
};
