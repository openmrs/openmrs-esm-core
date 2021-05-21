import React from "react";
import { render } from "react-dom";
import { Subject } from "rxjs";
import {
  CarbonNotification,
  NotificationDescriptor,
} from "./notification.component";
import ActiveNotifications from "./active-notifications.component";
import isEmpty from "lodash-es/isEmpty";

const inlineNotificationsSubject = new Subject<CarbonNotification>();
const toastSubject = new Subject<CarbonNotification>();
let notificationId = 0;

export enum NotificationVariant {
  INLINE,
  TOAST,
}

export function renderInlineNotifications(target: HTMLElement | null) {
  if (target) {
    render(
      <ActiveNotifications subject={inlineNotificationsSubject} />,
      target
    );
  }
}

export function renderToasts(target: HTMLElement | null) {
  if (target) {
    render(<ActiveNotifications subject={toastSubject} />, target);
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
    switch (notification.type) {
      case NotificationVariant.INLINE:
        setTimeout(() => {
          // always use in subsequent cycle
          inlineNotificationsSubject.next({
            ...notification,
            id: notificationId++,
          });
        }, 0);
        break;

      case NotificationVariant.TOAST:
        setTimeout(() => {
          // always use in subsequent cycle
          toastSubject.next({
            ...notification,
            id: notificationId++,
          });
        }, 0);
        break;
      default:
        break;
    }
  } else {
    console.error(
      `showNotification must be called with an object having a 'description' property that is a non-empty string or object`
    );
  }
}
