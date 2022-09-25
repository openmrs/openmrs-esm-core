import React from "react";
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
    progressActionLabel = "Undoing",
    ...props
  } = notification;

  return (
    <ActionableNotification
      kind={kind || "info"}
      actionButtonLabel={actionButtonLabel || progressActionLabel}
      ariaLabel="closes notification"
      onActionButtonClick={onActionButtonClick}
      onClose={function noRefCheck() {}}
      onCloseButtonClick={function noRefCheck() {}}
      statusIconDescription="notification"
      subtitle={subtitle}
      title={title}
      lowContrast={critical}
      inline={true}
      {...props}
    />
  );
};
