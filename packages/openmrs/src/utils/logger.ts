/* eslint-disable no-console */

export function logInfo(message: string) {
  console.log(`[openmrs] ${message}`);
}

export function logWarn(message: string) {
  console.warn(`[openmrs] ${message}`);
}

export function logFail(message: string) {
  console.error(`[openmrs] ${message}`);
}
