/** @module @category Offline */

async function isSafariPrivateBrowsing() {
  const storage = window.sessionStorage;

  try {
    storage.setItem('someKeyHere', 'test');
    storage.removeItem('someKeyHere');
  } catch (e) {
    if (e.code === DOMException.QUOTA_EXCEEDED_ERR && storage.length === 0) {
      return true;
    }
  }

  return false;
}

async function isEdgePrivateBrowsing() {
  return !window.indexedDB;
}

async function isFirefoxPrivateBrowsing() {
  return new Promise<boolean>((resolve) => {
    const db = indexedDB.open('test');
    db.onerror = () => resolve(true);
    db.onsuccess = () => resolve(false);
  });
}

async function isPrivateBrowsing() {
  return (await isFirefoxPrivateBrowsing()) || (await isEdgePrivateBrowsing()) || (await isSafariPrivateBrowsing());
}

export type OfflineMode = "on" | "off" | "unavailable";
export type OfflineHandler = () => void | Promise<void>;

export interface OfflineModeResult {
  current: OfflineMode;
  notAvailable: boolean;
  active: boolean;
  lastRun: string;
}

const offlineModeStorageKey = "openmrs:offline-mode";
let offlineMode: OfflineMode = "unavailable";
let lastRun: string = "";

export function getCurrentOfflineMode(): OfflineModeResult {
  return {
    current: offlineMode,
    notAvailable: offlineMode === "unavailable",
    active: offlineMode === "on",
    lastRun: lastRun,
  };
}

export function setCurrentOfflineMode(mode: OfflineMode) {
  if (offlineMode !== 'unavailable' && mode !== 'unavailable') {
    localStorage.setItem(offlineModeStorageKey, mode === 'on' ? 'active' : 'disabled');
    offlineMode = mode;
  }
}

export function registerOfflineHandler(setupOffline: OfflineHandler) {
  window.addEventListener("openmrs:offline-enabled", setupOffline);
  const offlineMode = getCurrentOfflineMode();
  if (offlineMode.active) {
    setupOffline();
  }
}

export async function activateOfflineCapability() {
  const isPrivate = await isPrivateBrowsing();

  if (!isPrivate) {
    if (localStorage.getItem(offlineModeStorageKey) === 'active') {
      offlineMode = 'on';
    } else {
      offlineMode = 'off';
    }
  }

  if (navigator.onLine && offlineMode === 'on') {
    //TODO trigger here --> update cycle
  }
}
