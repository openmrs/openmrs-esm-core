/** @module @category UI */
import React, { useState, useEffect } from "react";
import { ActionableNotification } from "@carbon/react";

export interface SnackbarProps {
  snackbar: SnackbarMeta;
  closeSnackbar(): void;
}

export interface SnackbarDescriptor {
  actionButtonLabel?: string;
  onActionButtonClick?: () => void;
  subtitle?: string;
  title: string;
  kind?: SnackbarType | string;
  critical?: boolean;
  progressActionLabel?: string;
  duration?: number;
}

export interface SnackbarMeta extends SnackbarDescriptor {
  id: number;
}

export type SnackbarType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const SnackbarComponent: React.FC<SnackbarProps> = ({
  snackbar,
  closeSnackbar,
}) => {
  const {
    actionButtonLabel,
    onActionButtonClick = () => {},
    subtitle,
    kind,
    title,
    critical,
    progressActionLabel,
    duration,
    ...props
  } = snackbar;

  const [actionText, setActionText] = useState(actionButtonLabel);

  const handleActionClick = () => {
    onActionButtonClick();
    closeSnackbar();
    progressActionLabel && setActionText(progressActionLabel);
  };

  useEffect(() => {
    if (duration) {
      const timeoutId = setTimeout(closeSnackbar, duration);
      return () => clearTimeout(timeoutId);
    }
  }, [duration]);

  return (
    <ActionableNotification
      kind={kind || "info"}
      actionButtonLabel={actionText || ""}
      ariaLabel="Closes actionable snack bar"
      onActionButtonClick={handleActionClick}
      statusIconDescription="Actionable snack bar"
      subtitle={subtitle || ""}
      title={title}
      lowContrast={critical}
      onClose={closeSnackbar}
      inline
      {...props}
    />
  );
};
