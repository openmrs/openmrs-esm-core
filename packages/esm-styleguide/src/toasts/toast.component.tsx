import React from "react";
import { maybe } from "kremling";
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
  const { millis, title, description, kind, action } = Object.assign(
    {},
    toast,
    defaultOptions
  );

  const [waitingForTime, setWaitingForTime] = React.useState(true);
  const [isMounting, setIsMounting] = React.useState(true);
  const onClose = React.useCallback(() => closeToast(toast), []);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(() => closeToast(toast), millis);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingForTime]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsMounting(false);
    }, 20);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={maybe("omrs-toast-closing", isClosing).maybe(
        "omrs-toast-mounting",
        isMounting
      )}
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
