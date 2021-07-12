import React from "react";
import { InlineNotification } from "carbon-components-react/es/components/Notification";
import { InlineNotificationMeta, removeNotificationFromStore } from "./state";

export interface NotificationProps {
  notification: InlineNotificationMeta;
}

export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { description, action, kind, critical, title } = notification;
  const onClose = React.useCallback(
    () => removeNotificationFromStore(notification.id),
    [notification.id]
  );

  return (
    <InlineNotification
      actions={action}
      kind={kind || "info"}
      lowContrast={critical}
      subtitle={description}
      title={title || ""}
      onCloseButtonClick={onClose}
    />
  );
};
