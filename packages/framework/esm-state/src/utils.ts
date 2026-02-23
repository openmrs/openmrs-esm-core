/**
 * Check if we're in a test environment (Vitest or Jest)
 * Exported in a separate file so it can be mocked in tests
 * @internal
 */
export function isTestEnvironment() {
  try {
    return (
      process.env.NODE_ENV === 'test' ||
      (typeof process !== 'undefined' && (process.env.VITEST === 'true' || process.env.JEST_WORKER_ID !== undefined)) ||
      (typeof globalThis !== 'undefined' && ('__vitest_worker__' in globalThis || '__jest__' in globalThis))
    );
  } catch {
    return false;
  }
}
