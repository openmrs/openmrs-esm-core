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

export interface ShowToastEvent {
  kind?:
    | "error"
    | "info"
    | "info-square"
    | "success"
    | "warning"
    | "warning-alt";
  title?: string;
  description: any;
  action?: any;
  millis?: number;
}

const toastShownEventName = "openmrs:toast-shown";

export function dispatchToastShown(data: ShowToastEvent) {
  window.dispatchEvent(new CustomEvent(toastShownEventName, { detail: data }));
}

export function subscribeToastShown(cb: (data: ShowToastEvent) => void) {
  const handler = (ev: CustomEvent) => cb(ev.detail);
  window.addEventListener(toastShownEventName, handler);
  return () => window.removeEventListener(toastShownEventName, handler);
}
