import { isOnline } from '@openmrs/esm-utils';

export function checkStatus(online: boolean | object = true, offline: boolean | object = false) {
  return checkStatusFor(isOnline(), online, offline);
}

export function checkStatusFor(status: boolean, online: boolean | object = true, offline: boolean | object = false) {
  return Boolean(status ? online : offline);
}
