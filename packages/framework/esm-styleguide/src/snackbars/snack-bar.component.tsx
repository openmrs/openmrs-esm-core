/** @module @category UI */
import React, { useState } from "react";
import { ActionableNotification } from "@carbon/react";

export interface SnackBarProps {
  notification: SnackBarMeta;
}

export interface SnackBarDescriptor {
  actionButtonLabel?: string;
  onActionButtonClick?: () => void;
  onClose?: () => void;
  subtitle?: string;
  title: string;
  kind?: SnackBarType | string;
  critical?: boolean;
  progressActionLabel?: string;
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
  notification,
}) => {
  const {
    actionButtonLabel,
    onActionButtonClick = () => {},
    subtitle,
    kind,
    title,
    critical,
    progressActionLabel,
    ...props
  } = notification;

  const [actionText, setActionText] = useState(actionButtonLabel);

  const handleActionClick = () => {
    onActionButtonClick();
    progressActionLabel && setActionText(progressActionLabel);
  };

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
      inline
      {...props}
    />
  );
};
