/**
 * Payload returned from the "page-change" event
 */
export interface PageChanged {
  /**
   * This function controls whether or not the page change goes ahead.
   * Call this to interrupt the page navigation, e.g., if a user requested
   * not to change the page.
   *
   * @param val If this is a value that ultimately results as "true", then navigation
   *   is cancelled, which is the default value.
   */
  cancelNavigation(val?: boolean | Promise<boolean> | (() => boolean | Promise<boolean>)): void;
  /**
   * The name of the main content page that will be displayed, e.g., "@openmrs/esm-my-app-page-0".
   * May be undefined if the navigation will not result in a main content page.
   */
  newPage: string | undefined;
  /**
   * The URL currently used by single-spa to determine the layout
   */
  oldUrl: string;
  /**
   * The URL that will be in effect once this update cycle is complete
   */
  newUrl: string;
}

/**
 * This is the set of events supported by the custom event system
 */
export interface EventTypes {
  /**
   * The started event is fired once when the app started.
   * Listeners should use this as an opportunity to do any initialization required.
   */
  started: never;
  /**
   * The before-page-changed event is fired before the active page in the application changes
   */
  'before-page-changed': PageChanged;
}

/**
 * This type is the union of all supported events
 */
export type OpenmrsEvent = keyof EventTypes;

export type EventsWithoutPayload = {
  [K in OpenmrsEvent]: EventTypes[K] extends undefined ? K : never;
}[OpenmrsEvent];

export type EventsWithPayload = {
  [K in OpenmrsEvent]: EventTypes[K] extends undefined ? never : K;
}[OpenmrsEvent];
