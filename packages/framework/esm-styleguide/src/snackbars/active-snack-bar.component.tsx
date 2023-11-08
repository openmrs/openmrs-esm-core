import React, { useEffect, useState } from "react";
import { Subject } from "rxjs";
import { SnackBarComponent, SnackBarMeta } from "./snack-bar.component";

interface ActiveSnackBarProps {
  subject: Subject<SnackBarMeta>;
}

const ActiveSnackBars: React.FC<ActiveSnackBarProps> = ({ subject }) => {
  const [notifications, setNotifications] = useState<Array<SnackBarMeta>>([]);

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
        <SnackBarComponent key={notification.id} notification={notification} />
      ))}
    </>
  );
};

export default ActiveSnackBars;
