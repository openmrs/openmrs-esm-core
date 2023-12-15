/** @module @category Utility */

/**
 * Simple utility function to determine if an object implementing the WebStorage API
 * is actually available. Useful for testing the availability of `localStorage` or
 * `sessionStorage`.
 *
 * @param storage The WebStorage API object to check. Defaults to `localStorage`.
 * @returns True if the WebStorage API object is able to be accessed, false otherwise
 */
export function canAccessStorage(storage: Storage = window.localStorage) {
  try {
    storage.getItem('test');
    return true;
  } catch {
    return false;
  }
}
