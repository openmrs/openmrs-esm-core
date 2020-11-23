import React from "react";
import { always } from "kremling";
import { InlineNotification } from "carbon-components-react/es/components/Notification";

const defaultOptions = {
  millis: 4000,
};

interface ToastProps {
  toast: ToastDescriptor;
  closeToast: any;
  isClosing: any;
}

interface ToastDescriptor {
  kind: ToastType;
  title: string;
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
  const { millis, description } = Object.assign({}, toast, defaultOptions);

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
    <>
      <InlineNotification
        kind={toast.kind || "info"}
        subtitle={toast.description}
        title={toast.title || ""}
      />
    </>
  );
};
