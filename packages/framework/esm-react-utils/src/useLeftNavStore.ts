/** @module @category UI */
import { leftNavStore } from '@openmrs/esm-extensions';
import { useStore } from './useStore';

/**
 * A React hook that provides access to the left navigation store state.
 * The component will re-render whenever the left navigation state changes.
 *
 * @returns The current state of the left navigation store.
 *
 * @example
 * ```tsx
 * import { useLeftNavStore } from '@openmrs/esm-framework';
 * function MyComponent() {
 *   const leftNavState = useLeftNavStore();
 *   return <div>Current nav: {leftNavState.activeNavName}</div>;
 * }
 * ```
 */
export function useLeftNavStore() {
  return useStore(leftNavStore);
}
