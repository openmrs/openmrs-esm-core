import Dexie, { Table } from "dexie";

/**
 * Contains information about dynamic route registrations.
 * Dynamic route registrations are routes which should be cached using a Network First approach,
 * but are not by default known by the Service Worker.
 * They are typically registerd by the the window/app at runtime as soon as they are known.
 */
export interface DynamicRouteRegistration {
  /**
   * A regular expression which matches against a URL.
   * If it matches, the URL should be cached.
   */
  pattern: string;
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
