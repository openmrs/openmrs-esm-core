/** @module @category Extension */
import { useMemo } from "react";
import {
  ConnectedExtension,
  getConnectedExtensions,
} from "@openmrs/esm-extensions";
import { useConnectivity } from "./useConnectivity";
import { useAssignedExtensions } from "./useAssignedExtensions";

/**
 * Gets the assigned extension for a given extension slot name.
 * Considers if offline or online.
 * @param slotName The name of the slot to get the assigned extensions for.
 */
export function useConnectedExtensions(
  slotName: string
): Array<ConnectedExtension> {
  const online = useConnectivity();
  const assignedExtensions = useAssignedExtensions(slotName);

  const connectedExtensions = useMemo(() => {
    return getConnectedExtensions(assignedExtensions, online);
  }, [assignedExtensions, online]);

  return connectedExtensions;
}
