/** @module @category UI */
import React, { useState } from "react";
import { ActionableNotification } from "@carbon/react";

// Design documentation for Actionable Toast https://zeroheight.com/23a080e38/p/683580-notifications/t/26d1c7
export interface ActionableToastProps {
  actionableToast: ActionableToastMeta;
  closeActionableToast(): void;
}

export interface ActionableToastDescriptor {
  actionButtonLabel?: string;
  isLowContrast?: boolean;
  kind?: ActionableToastType | string;
  onActionButtonClick?: () => void;
  progressActionLabel?: string;
  subtitle?: string;
  title: string;
}

export interface ActionableToastMeta extends ActionableToastDescriptor {
  id: number;
}

export type ActionableToastType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export const ActionableToast: React.FC<ActionableToastProps> = ({
  actionableToast,
  closeActionableToast,
}) => {
  const {
    actionButtonLabel,
    isLowContrast,
    kind,
    onActionButtonClick = () => {},
    progressActionLabel,
    subtitle,
    title,
    ...props
  } = actionableToast;

  const [actionText, setActionText] = useState(actionButtonLabel);

  const handleActionClick = () => {
    onActionButtonClick();
    closeActionableToast();
    progressActionLabel && setActionText(progressActionLabel);
  };

  return (
    <ActionableNotification
      actionButtonLabel={actionText || ""}
      ariaLabel="Close actionable toast"
      kind={kind || "info"}
      lowContrast={isLowContrast}
      onActionButtonClick={handleActionClick}
      onClose={closeActionableToast}
      statusIconDescription="Actionable toast notification"
      subtitle={subtitle || ""}
      title={title}
      {...props}
    />
  );
};
