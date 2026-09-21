/**
 * Compatibility shims for APIs that have been removed from the framework.
 *
 * These exist only so that frontend modules built against an older framework
 * don't break at runtime while their authors migrate. They are intentionally
 * no-ops and will be removed in a future major release.
 */

/**
 * @deprecated Offline support has been removed from the framework. This is a
 * no-op kept only so that frontend modules that still call `setupOfflineSync`
 * during registration don't throw. Remove your offline sync handlers; queued
 * items will no longer be synchronized.
 */
export function setupOfflineSync<T = unknown>(
  _type: string,
  _dependsOn: Array<string>,
  _process: (item: T, options: unknown) => Promise<unknown>,
  _options?: unknown,
): void {
  // no-op: offline synchronization was removed from the framework
}

/**
 * @deprecated Offline support has been removed from the framework. This is a
 * no-op kept only so that frontend modules that still call
 * `setupDynamicOfflineDataHandler` during registration don't throw. Remove your
 * dynamic offline data handlers; their data will no longer be cached for offline use.
 */
export function setupDynamicOfflineDataHandler(_handler: { id: string; type: string; [key: string]: unknown }): void {
  // no-op: dynamic offline data was removed from the framework
}

/**
 * @deprecated The offline service worker has been removed from the framework.
 * This is a no-op kept only so that frontend modules that still call
 * `messageOmrsServiceWorker` don't throw. It always resolves to an
 * unsuccessful result, mirroring the previous "no service worker registered"
 * behavior.
 */
export function messageOmrsServiceWorker(
  _message: unknown,
): Promise<{ success: false; result: undefined; error: string }> {
  return Promise.resolve({
    success: false,
    result: undefined,
    error: 'No service worker has been registered. Offline-related features have been removed from the framework.',
  });
}

/**
 * @deprecated Offline support has been removed from the framework. This is a
 * no-op kept only so that frontend modules that still call
 * `subscribePrecacheStaticDependencies` don't throw. The callback is never
 * invoked. Returns a no-op unsubscribe function so existing teardown code keeps working.
 */
export function subscribePrecacheStaticDependencies(_callback: (data: unknown) => void): () => void {
  // no-op: static dependency precaching was removed from the framework
  return () => {};
}

/**
 * @deprecated Offline support has been removed from the framework. This is a
 * no-op kept only so that frontend modules that still call
 * `useConnectivity` don't throw.
 */
export function useConnectivity() {
  return true;
}
