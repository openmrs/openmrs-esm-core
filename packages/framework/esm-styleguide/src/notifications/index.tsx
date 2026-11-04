/** @module @category UI */
import React from 'react';
import { isEmpty } from 'lodash-es';
import { createRoot } from 'react-dom/client';
import type { InlineNotificationMeta, NotificationDescriptor } from './notification.component';
import type { ActionableNotificationMeta, ActionableNotificationDescriptor } from './actionable-notification.component';
import ActiveNotifications from './active-notifications.component';
import ActionableActiveNotifications from './active-actionable-notifications.component';
import { Emitter } from '../emitter';

const inlineNotificationsSubject = new Emitter<InlineNotificationMeta>();
let notificationId = 0;

const actionableNotificationsSubject = new Emitter<ActionableNotificationMeta>();
let actionableNotificationId = 0;

/**
 * Starts a rendering host for inline notifications. Should only be used by the app shell.
 * Under normal conditions there is no need to use this function.
 * @param target The container target that hosts the inline notifications.
 */
export function renderInlineNotifications(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActiveNotifications subject={inlineNotificationsSubject} />);
  }
}

function isNotEmpty(description: React.ReactNode) {
  if (typeof description === 'string') {
    return description.trim().length > 0;
  } else if (typeof description === 'object') {
    return description instanceof Error || !isEmpty(description);
  }

  return false;
}

/**
 * Displays an inline notification in the UI.
 * @param notification The description of the notification to display.
 */
export function showNotification(notification: NotificationDescriptor) {
  if (notification && isNotEmpty(notification.description)) {
    if ((notification.description as unknown) instanceof Error) {
      notification.description = notification.description.toLocaleString();
    }

    setTimeout(() => {
      // always use in subsequent cycle
      inlineNotificationsSubject.next({
        ...notification,
        id: notificationId++,
      });
    }, 0);
  } else {
    console.error(
      `showNotification must be called with an object having a 'description' property that is a non-empty string or object`,
    );
  }
}

// Actionable Notifications

export function renderActionableNotifications(target: HTMLElement | null) {
  if (target) {
    const root = createRoot(target);
    root.render(<ActionableActiveNotifications subject={actionableNotificationsSubject} />);
  }
}

function isNotActionableNotificationEmpty(subtitle: React.ReactNode) {
  return typeof subtitle === 'string'
    ? subtitle.trim().length > 0
    : typeof subtitle === 'object'
      ? !isEmpty(subtitle)
      : false;
}

/**
 * Displays an actionable notification in the UI.
 * @param notification The description of the notification to display.
 */

export function showActionableNotification(notification: ActionableNotificationDescriptor) {
  if (notification && isNotActionableNotificationEmpty(notification.actionButtonLabel)) {
    setTimeout(() => {
      // always use in subsequent cycle
      actionableNotificationsSubject.next({
        ...notification,
        id: actionableNotificationId++,
      });
    }, 0);
  } else {
    console.error(`showActionableNotification must be called with an actionButtonLabel that is a non-empty string`);
  }
}
