import React from "react";
import { Notification } from "./notification.component";
import { InlineNotificationMeta, subscribeNotifications } from "./state";

interface ActiveNotificationProps {}

const ActiveNotifications: React.FC<ActiveNotificationProps> = () => {
  const [notifications, setNotifications] = React.useState<
    Array<InlineNotificationMeta>
  >([]);

  React.useEffect(
    () =>
      subscribeNotifications((state) => {
        setNotifications(state.notifications);
      }),
    []
  );

  return (
    <>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </>
  );
};

export default ActiveNotifications;
