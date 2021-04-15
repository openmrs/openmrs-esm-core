import { ImportMap } from "@openmrs/esm-globals";
import { PrecacheEntry } from "workbox-precaching/_types";

// Globals injected by Workbox at build time.
declare global {
  interface Window {
    __WB_MANIFEST: Array<PrecacheEntry>;
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

export interface MessageResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
}

export interface OnImportMapChangedMessage {
  importMap: ImportMap;
}

export interface RegisterDynamicRouteMessage {
  url?: string;
  pattern?: string;
}
