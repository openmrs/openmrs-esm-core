import type {} from '@openmrs/esm-globals';

export function isOnline(online?: boolean) {
  return window.offlineEnabled ? online ?? navigator.onLine : true;
}
