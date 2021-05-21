export interface ConnectivityChangedEvent {
  online: boolean;
}

const connectivityChangedEventName = "openmrs:connectivity-changed";

export function dispatchConnectivityChanged(online: boolean) {
  window.dispatchEvent(
    new CustomEvent(connectivityChangedEventName, { detail: { online } })
  );
}

export function subscribeConnectivityChanged(
  cb: (ev: ConnectivityChangedEvent) => void
) {
  const handler = (ev: CustomEvent) => cb(ev.detail);
  window.addEventListener(connectivityChangedEventName, handler);
  return () =>
    window.removeEventListener(connectivityChangedEventName, handler);
}

export function subscribeConnectivity(
  cb: (ev: ConnectivityChangedEvent) => void
) {
  cb({ online: navigator.onLine });
  return subscribeConnectivityChanged(cb);
}

export interface ShowNotificationEvent {
  description: any;
  kind?:
    | "error"
    | "info"
    | "info-square"
    | "success"
    | "warning"
    | "warning-alt";
  title?: string;
  action?: any;
  millis?: number;
}

export interface ShowToastEvent {
  description: any;
  kind?:
    | "error"
    | "info"
    | "info-square"
    | "success"
    | "warning"
    | "warning-alt";
  title?: string;
  millis?: number;
}

const notificationShownName = "openmrs:notification-shown";
const toastShownName = "openmrs:toast-shown";

export function dispatchNotificationShown(data: ShowNotificationEvent) {
  window.dispatchEvent(
    new CustomEvent(notificationShownName, { detail: data })
  );
}

export function subscribeNotificationShown(
  cb: (data: ShowNotificationEvent) => void
) {
  const handler = (ev: CustomEvent) => cb(ev.detail);
  window.addEventListener(notificationShownName, handler);
  return () => window.removeEventListener(notificationShownName, handler);
}

export function subscribeToastShown(cb: (data: ShowToastEvent) => void) {
  const handler = (ev: CustomEvent) => cb(ev.detail);
  window.addEventListener(toastShownName, handler);
  return () => window.removeEventListener(toastShownName, handler);
}
