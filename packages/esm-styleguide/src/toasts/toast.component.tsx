import React from "react";
import { InlineNotification } from "carbon-components-react/es/components/Notification";

const defaultOptions = {
  millis: 4000,
};

export interface ToastProps {
  toast: ToastNotification;
  closeToast(): void;
}

export interface ToastDescriptor {
  kind?: ToastType;
  title?: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  millis?: number;
}

export interface ToastNotification extends ToastDescriptor {
  id: number;
}

export type ToastType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const Toast: React.FC<ToastProps> = ({ toast, closeToast }) => {
  const {
    millis = defaultOptions.millis,
    title,
    description,
    kind,
    action,
  } = toast;
  const [waitingForTime, setWaitingForTime] = React.useState(true);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(closeToast, millis);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingForTime]);

  return (
    <div
      onMouseEnter={() => setWaitingForTime(false)}
      onMouseLeave={() => setWaitingForTime(true)}
    >
      <InlineNotification
        kind={kind || "info"}
        subtitle={description}
        title={title || ""}
        actions={action}
      />
    </div>
  );
};
