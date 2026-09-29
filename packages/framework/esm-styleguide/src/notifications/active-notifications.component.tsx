import React, { useEffect, useState } from 'react';
import type { InlineNotificationMeta } from './notification.component';
import { Notification } from './notification.component';
import type { Emitter } from '../emitter';

interface ActiveNotificationProps {
  subject: Emitter<InlineNotificationMeta>;
}

const ActiveNotifications: React.FC<ActiveNotificationProps> = ({ subject }) => {
  const [notifications, setNotifications] = useState<Array<InlineNotificationMeta>>([]);

  useEffect(() => {
    const subscription = subject.subscribe((notification) =>
      setNotifications((notifications) => [
        ...notifications.filter(
          (n) =>
            n.description !== notification.description ||
            n.action !== notification.action ||
            n.kind !== notification.kind ||
            n.title !== notification.title,
        ),
        notification,
      ]),
    );

    return () => subscription.unsubscribe();
  }, [subject]);

  return (
    <>
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </>
  );
};

export default ActiveNotifications;
