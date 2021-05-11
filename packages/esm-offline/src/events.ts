import { NetworkRequestFailedEvent } from './service-worker-events';

const networkRequestFailedEventName = "openmrs:network-request-failed";

export function dispatchNetworkRequestFailed(data: NetworkRequestFailedEvent) {
  window.dispatchEvent(new CustomEvent(networkRequestFailedEventName, { detail: data }));
}

export function subscribeNetworkRequestFailed(cb: (data: NetworkRequestFailedEvent) => void) {
  const handler = (ev: CustomEvent) => cb(ev.detail);
  window.addEventListener(networkRequestFailedEventName, handler);
  return () => window.removeEventListener(networkRequestFailedEventName, handler);
}
