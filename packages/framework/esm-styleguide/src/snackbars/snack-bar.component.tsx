/** @module @category UI */
import React, { useState, useEffect } from "react";
import { ActionableNotification } from "@carbon/react";

export interface SnackBarProps {
  snackBar: SnackBarMeta;
  closeSnackBar(): void;
}

export interface SnackBarDescriptor {
  actionButtonLabel?: string;
  onActionButtonClick?: () => void;
  subtitle?: string;
  title: string;
  kind?: SnackBarType | string;
  critical?: boolean;
  progressActionLabel?: string;
  duration?: number;
}

export interface SnackBarMeta extends SnackBarDescriptor {
  id: number;
}

export type SnackBarType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const SnackBarComponent: React.FC<SnackBarProps> = ({
  snackBar,
  closeSnackBar,
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
  } = snackBar;

  const [actionText, setActionText] = useState(actionButtonLabel);

  const handleActionClick = () => {
    onActionButtonClick();
    closeSnackBar();
    progressActionLabel && setActionText(progressActionLabel);
  };

  useEffect(() => {
    if (duration) {
      const timeoutId = setTimeout(closeSnackBar, duration);
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
      onClose={closeSnackBar}
      inline
      {...props}
    />
  );
};
