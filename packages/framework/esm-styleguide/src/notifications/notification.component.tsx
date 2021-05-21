import React from "react";
import {
  InlineNotification,
  ToastNotification,
} from "carbon-components-react/lib/components/Notification";
import { NotificationVariant } from "./index";

const defaultOptions = {
  millis: 4000,
};

export interface NotificationProps {
  notification: CarbonNotification;
  closeNotification(): void;
}

export interface NotificationDescriptor {
  description: React.ReactNode;
  type: NotificationVariant;
  action?: React.ReactNode;
  kind?: NotificationType;
  millis?: number;
  title?: string;
}

export interface CarbonNotification extends NotificationDescriptor {
  id: number;
}

export type NotificationType =
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
    type,
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
      {type === NotificationVariant.INLINE ? (
        <InlineNotification
          lowContrast
          actions={action}
          kind={kind || "info"}
          subtitle={description}
          title={title || ""}
        />
      ) : null}
      {type === NotificationVariant.TOAST ? (
        <ToastNotification
          lowContrast
          kind={kind || "info"}
          subtitle={description}
          title={title || ""}
          timeout={millis}
        />
      ) : null}
    </div>
  );
};
