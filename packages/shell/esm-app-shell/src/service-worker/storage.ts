import type { OmrsOfflineCachingStrategy } from "@openmrs/esm-offline";
import Dexie, { Table } from "dexie";

/**
 * Contains information about dynamic route registrations.
 * Dynamic route registrations are routes which should be kept in the cache,
 * but are not by default known by the Service Worker.
 * They are typically registerd by the the window/app at runtime as soon as they are known.
 */
export interface DynamicRouteRegistration {
  /**
   * A regular expression which matches against a URL.
   * If it matches, the URL should be cached using the `strategy`.
   */
  pattern: string;
  /**
   * The caching strategy to be used for caching matching URLs.
   * Due to historical reasons, this value might be missing.
   * In such cases, `network-first` should be assumed (the historical default).
   */
  strategy?: OmrsOfflineCachingStrategy;
}

/**
 * Provides access to persistent data used by the Service Worker.
 */
export class ServiceWorkerDb extends Dexie {
  dynamicRouteRegistrations: Table<DynamicRouteRegistration, number>;

  constructor() {
    super("ServiceWorker");
    this.version(1).stores({ dynamicRouteRegistrations: "++,&pattern" });

    this.dynamicRouteRegistrations = this.table("dynamicRouteRegistrations");
  }
}
