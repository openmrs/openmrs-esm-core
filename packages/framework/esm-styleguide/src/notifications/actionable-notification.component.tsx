import React, { useState } from "react";
import { ActionableNotification } from "@carbon/react";
/** @module @category UI */

export interface ActionableNotificationProps {
  notification: ActionableNotificationMeta;
}

export interface ActionableNotificationDescriptor {
  actionButtonLabel: string;
  onActionButtonClick: () => void;
  onClose?: () => void;
  subtitle: string;
  title?: string;
  kind?: ActionableNotificationType | string;
  critical?: boolean;
  progressActionLabel?: string;
}

export interface ActionableNotificationMeta
  extends ActionableNotificationDescriptor {
  id: number;
}

export type ActionableNotificationType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const ActionableNotificationComponent: React.FC<
  ActionableNotificationProps
> = ({ notification }) => {
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
      actionButtonLabel={actionText}
      ariaLabel="Closes actionable notification"
      onActionButtonClick={handleActionClick}
      statusIconDescription="Actionable notification"
      subtitle={subtitle}
      title={title}
      lowContrast={critical}
      inline
      {...props}
    />
  );
};
