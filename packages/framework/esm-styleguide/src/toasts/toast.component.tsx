/** @module @category UI */
import React, { useEffect, useState } from "react";
import { ToastNotification } from "@carbon/react";

const defaultOptions = {
  millis: 5000,
};

export interface ToastProps {
  toast: ToastNotificationMeta;
  closeToast(): void;
}

export interface ToastDescriptor {
  description: React.ReactNode;
  kind?: ToastType;
  critical?: boolean;
  title?: string;
  millis?: number;
}

export interface ToastNotificationMeta extends ToastDescriptor {
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
    description,
    kind,
    critical,
    title,
    millis = defaultOptions.millis,
  } = toast;

  const [waitingForTime, setWaitingForTime] = useState(true);

  useEffect(() => {
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
      <ToastNotification
        kind={kind || "info"}
        lowContrast={critical}
        subtitle={description}
        title={title || ""}
        timeout={millis}
      />
    </div>
  );
};
