import { createGlobalStore } from "@openmrs/esm-state";

interface NotificationState {
  notifications: Array<InlineNotificationMeta>;
}

const notificationStore = createGlobalStore<NotificationState>(
  "globalNotificationState",
  {
    notifications: [],
  }
);

export function subscribeNotifications(
  handle: (state: NotificationState) => void
) {
  handle(notificationStore.getState());
  return notificationStore.subscribe(handle);
}

export function removeNotificationFromStore(notificationId: number) {
  const state = notificationStore.getState();
  notificationStore.setState({
    ...state,
    notifications: state.notifications.filter((n) => n.id !== notificationId),
  });
}

export function addNotificationToStore(notification: InlineNotificationMeta) {
  const state = notificationStore.getState();
  notificationStore.setState({
    ...state,
    notifications: [...state.notifications, notification],
  });
}

export type InlineNotificationType =
  | "error"
  | "info"
  | "info-square"
  | "success"
  | "warning"
  | "warning-alt";

export interface NotificationDescriptor {
  description: React.ReactNode;
  action?: React.ReactNode;
  kind?: InlineNotificationType;
  critical?: boolean;
  title?: string;
}

export interface InlineNotificationMeta extends NotificationDescriptor {
  id: number;
}
