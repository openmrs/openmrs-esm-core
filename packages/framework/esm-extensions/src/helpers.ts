export function checkStatus(
  online: boolean | object = true,
  offline: boolean | object = false
) {
  const status = navigator.onLine;
  return checkStatusFor(status, online, offline);
}

export function checkStatusFor(
  status: boolean,
  online: boolean | object = true,
  offline: boolean | object = false
) {
  return Boolean(status ? online : offline);
}
