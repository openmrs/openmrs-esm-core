import type { PrecacheEntry } from "workbox-precaching/_types";

// Globals injected by Workbox at build time.
declare global {
  interface Window {
    __WB_MANIFEST: Array<PrecacheEntry>;
    __WB_DISABLE_DEV_LOGS: boolean;
    clients: Clients;
    skipWaiting(): void;
  }
}

/**
 * The expected structure of a build manifest of MFs which can, by resolved via the app's import map.
 * The manifest contains URLs to files which should be cached in order to provide offline support.
 */
export interface BuildManifest {
  chunks?: Array<{
    files?: Array<string>;
  }>;
}
