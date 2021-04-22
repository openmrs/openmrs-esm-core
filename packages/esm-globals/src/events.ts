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

const showToastEventName = "openmrs:show-toast";

export function dispatchShowToast(data: ShowToastEvent) {
  window.dispatchEvent(new CustomEvent(showToastEventName, { detail: data }));
}

export function subscribeShowToast(cb: (data: ShowToastEvent) => void) {
  const handler = (ev: CustomEvent) => cb(ev.detail);
  window.addEventListener(showToastEventName, handler);
  return () => window.removeEventListener(showToastEventName, handler);
}
