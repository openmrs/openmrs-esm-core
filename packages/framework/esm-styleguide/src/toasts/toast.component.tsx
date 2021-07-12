import React from "react";
import { ToastNotification } from "carbon-components-react/es/components/Notification";
import { ToastNotificationMeta, removeToastFromStore } from "./state";

const defaultOptions = {
  millis: 5000,
};

export interface ToastProps {
  toast: ToastNotificationMeta;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  const {
    description,
    kind,
    critical,
    title,
    millis = defaultOptions.millis,
  } = toast;

  const [waitingForTime, setWaitingForTime] = React.useState(true);
  const onClose = React.useCallback(
    () => removeToastFromStore(toast.id),
    [toast.id]
  );
  const enter = React.useCallback(() => setWaitingForTime(false), []);
  const leave = React.useCallback(() => setWaitingForTime(true), []);

  React.useEffect(() => {
    if (waitingForTime) {
      const timeoutId = setTimeout(onClose, millis);
      return () => clearTimeout(timeoutId);
    }
  }, [waitingForTime, onClose]);

  return (
    <div onMouseEnter={enter} onMouseLeave={leave}>
      <ToastNotification
        kind={kind || "info"}
        lowContrast={critical}
        subtitle={description}
        title={title || ""}
        timeout={millis}
        onCloseButtonClick={onClose}
      />
    </div>
  );
};
