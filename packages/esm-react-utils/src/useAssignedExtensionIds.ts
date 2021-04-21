import { useMemo } from "react";
import { useExtensionStore } from "./useExtensionStore";

export function useAssignedExtensionIds(moduleName: string, slotName: string) {
  const store = useExtensionStore();
  return useMemo(() => {
    const ids = store.slots[slotName]?.instances[moduleName]?.assignedIds ?? [];
    return ids.map((id) => store.extensions[id]);
  }, [store]);
}
