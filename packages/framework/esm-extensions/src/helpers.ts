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

export function getCustomProps(
  online: boolean | object | undefined,
  offline: boolean | object | undefined
) {
  const status = navigator.onLine;
  const props = status ? online : offline;
  return typeof props === "object" ? props : {};
}
