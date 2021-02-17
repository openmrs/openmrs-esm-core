import React from "react";
import { InlineNotification } from "carbon-components-react/es/components/Notification";

const defaultOptions = {
  millis: 4000,
};

interface ToastProps {
  toast: ToastDescriptor;
  closeToast: any;
  isClosing: any;
}

export interface ToastDescriptor {
  id?: number;
  kind?: ToastType;
  title?: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  millis?: number;
}

export type ToastType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const Toast: React.FC<ToastProps> = ({
  toast,
  closeToast,
  isClosing,
}) => {
  const {
    millis = defaultOptions.millis,
    title,
    description,
    kind,
    action,
  } = toast;
  const [waitingForTime, setWaitingForTime] = React.useState(true);
  const [isMounting, setIsMounting] = React.useState(true);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(() => closeToast(toast), millis);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingForTime]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => setIsMounting(false), 20);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={[
        isClosing && "omrs-toast-closing",
        isMounting && "omrs-toast-mounting",
      ]
        .filter(Boolean)
        .join(" ")}
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
