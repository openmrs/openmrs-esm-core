import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import {
  ActionableNotificationMeta,
  ActionableNotificationComponent,
} from "./actionable-notification.component";

interface ActionableActiveNotificationProps {
  subject: Subject<ActionableNotificationMeta>;
}

const ActionableActiveNotifications: React.FC<
  ActionableActiveNotificationProps
> = ({ subject }) => {
  const [notifications, setNotifications] = useState<
    Array<ActionableNotificationMeta>
  >([]);

  useEffect(() => {
    const subscription = subject.subscribe((notification) =>
      setNotifications((notifications) => [
        ...notifications.filter(
          (n) =>
            n.subtitle !== notification.subtitle ||
            n.actionButtonLabel !== notification.actionButtonLabel ||
            n.onActionButtonClick !== notification.onActionButtonClick ||
            n.kind !== notification.kind ||
            n.title !== notification.title
        ),
        notification,
      ])
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {notifications.map((notification) => (
        <ActionableNotificationComponent
          key={notification.id}
          notification={notification}
        />
      ))}
    </>
  );
};

export default ActionableActiveNotifications;
