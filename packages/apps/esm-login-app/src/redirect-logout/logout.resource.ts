import { type Cache, type ScopedMutator } from 'swr';
import { logout } from '@openmrs/esm-framework/src/internal';

export async function performLogout(cache: Cache, mutate: ScopedMutator) {
  await logout();
  await clearSwrCache(cache, mutate);
}

// Clears the SWR cache without revalidating. `cache` and `mutate` must come from `useSWRConfig()`:
// SWR's global `mutate` targets SWR's default cache, not the shared cache that the component decorator
// provides to O3 apps. Keys are cleared by name because a key filter such as `mutate(() => true)` skips
// the keys that `useSWRInfinite` and `useSWRSubscription` store.
export function clearSwrCache(cache: Cache, mutate: ScopedMutator) {
  return Promise.all([...cache.keys()].map((key) => mutate(key, undefined, { revalidate: false })));
}
