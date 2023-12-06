/** @module @category UI */
import React, { useCallback } from "react";
import { ActionableNotification } from "@carbon/react";

// Design documentation for Actionable Toast https://zeroheight.com/23a080e38/p/683580-notifications/t/26d1c7
export interface ActionableToastProps {
  actionableToast: ActionableToastMeta;
  closeActionableToast(): void;
}

export interface ActionableToastDescriptor {
  actionButtonLabel?: string;
  critical?: boolean;
  kind?: ActionableToastType | string;
  onActionButtonClick?: () => void;
  description: React.ReactNode;
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
    critical,
    kind,
    onActionButtonClick = () => {},
    description,
    title,
    ...props
  } = actionableToast;

  const handleActionClick = useCallback(() => {
    onActionButtonClick();
    closeActionableToast();
  }, [closeActionableToast, onActionButtonClick]);

  return (
    <ActionableNotification
      actionButtonLabel={actionButtonLabel}
      ariaLabel="Close actionable toast"
      kind={kind || "info"}
      lowContrast={critical}
      onActionButtonClick={handleActionClick}
      onClose={closeActionableToast}
      statusIconDescription="Actionable toast notification"
      subtitle={description}
      title={title}
      {...props}
    />
  );
};
