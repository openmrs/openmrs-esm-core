import { PrecacheEntry } from "workbox-precaching/_types";

declare global {
  interface Window {
    __WB_MANIFEST: Array<PrecacheEntry>;
  }
}
