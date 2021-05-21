import React from "react";
import { render } from "react-dom";
import { Subject } from "rxjs";
import {
  InlineNotificationMeta,
  NotificationDescriptor,
} from "./notification.component";
import ActiveNotifications from "./active-notifications.component";
import isEmpty from "lodash-es/isEmpty";

const inlineNotificationsSubject = new Subject<InlineNotificationMeta>();
let notificationId = 0;

export function renderInlineNotifications(target: HTMLElement | null) {
  if (target) {
    render(
      <ActiveNotifications subject={inlineNotificationsSubject} />,
      target
    );
  }
}

function isNotEmpty(description: React.ReactNode) {
  return typeof description === "string"
    ? description.trim().length > 0
    : typeof description === "object"
    ? !isEmpty(description)
    : false;
}

export function showNotification(notification: NotificationDescriptor) {
  if (notification && isNotEmpty(notification.description)) {
    setTimeout(() => {
      // always use in subsequent cycle
      inlineNotificationsSubject.next({
        ...notification,
        id: notificationId++,
      });
    }, 0);
  } else {
    console.error(
      `showNotification must be called with an object having a 'description' property that is a non-empty string or object`
    );
  }
}
