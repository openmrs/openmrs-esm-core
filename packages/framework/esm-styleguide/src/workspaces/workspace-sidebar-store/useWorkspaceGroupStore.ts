import { useEffect, useState } from 'react';
import { getWorkspaceGroupStore } from '../workspaces';

/**
 * This hook is used to interact with the store of a workspace store.
 * A workspace store is defined as a group of workspaces that open in the same workspace group.
 *
 * In case a workspace group is not active, it will be considered as a standalone workspace, and hence this hook will return an empty object and updateFunction as an empty function.
 *
 * @internal
 *
 * @param {string} workspaceGroupName The workspaceGroupName of the workspace used when registering the workspace in the module's routes.json file.
 */
export function useWorkspaceGroupStore(workspaceGroupName?: string) {
  const [storeState, setStoreState] = useState<object>({});
  const [currentWorkspaceGroupName, setCurrentWorkspaceGroupName] = useState(workspaceGroupName);

  useEffect(() => {
    if (currentWorkspaceGroupName !== workspaceGroupName) {
      setCurrentWorkspaceGroupName(workspaceGroupName);
    }
  }, [workspaceGroupName]);

  useEffect(() => {
    const store = getWorkspaceGroupStore(currentWorkspaceGroupName);
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
  }, [currentWorkspaceGroupName]);

  return storeState;
}
