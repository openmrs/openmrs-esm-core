import { useEffect, useMemo, useState } from 'react';
import { getWorkspaceFamilyStore } from '../workspaces';
import type { StoreApi } from 'zustand/vanilla';

/**
 * This hook is used to interact with the store of a workspace family.
 * A workspace family is defined as a group of workspaces that share the same sidebarFamilyName.
 *
 * In case a workspace doesn't have a sidebarFamilyName, it will be considered as a standalone workspace, and hence this hook will return an empty object and updateFunction as an empty function.
 *
 * @internal
 *
 * @param {string} sidebarFamilyName The sidebarFamilyName of the workspace used when registering the workspace in the module's routes.json file.
 */
export function useWorkspaceFamilyStore(sidebarFamilyName: string) {
  const [storeState, setStoreState] = useState<object>({});
  const [currentSidebarFamilyName, setCurrentSidebarFamilyName] = useState(sidebarFamilyName);

  useEffect(() => {
    if (currentSidebarFamilyName !== sidebarFamilyName) {
      setCurrentSidebarFamilyName(sidebarFamilyName);
    }
  }, [sidebarFamilyName]);

  useEffect(() => {
    const store = getWorkspaceFamilyStore(currentSidebarFamilyName);
    let unsubscribe: () => void;
    if (store) {
      setStoreState(store.getState());
      unsubscribe = store.subscribe(setStoreState);
    }
    return () => {
      if (store) {
        unsubscribe?.();
      }
    };
  }, [currentSidebarFamilyName]);

  return storeState;
}
