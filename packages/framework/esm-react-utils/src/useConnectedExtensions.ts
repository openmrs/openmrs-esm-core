/** @module @category Extension */
import { useMemo } from "react";
import {
  ConnectedExtension,
  getConnectedExtensions,
} from "@openmrs/esm-extensions";
import { useConnectivity } from "./useConnectivity";
import { useAssignedExtensions } from "./useAssignedExtensions";
import { useStore } from "./useStore";
import { featureFlagsStore } from "@openmrs/esm-feature-flags";

/**
 * Gets the assigned extension for a given extension slot name.
 * Considers if offline or online, and what feature flags are enabled.
 * @param slotName The name of the slot to get the assigned extensions for.
 */
export function useConnectedExtensions(
  slotName: string
): Array<ConnectedExtension> {
  const online = useConnectivity();
  const assignedExtensions = useAssignedExtensions(slotName);
  const featureFlagStore = useStore(featureFlagsStore);

  const enabledFeatureFlags = useMemo(() => {
    return Object.entries(featureFlagStore.flags)
      .filter(([, { enabled }]) => enabled)
      .map(([name]) => name);
  }, [featureFlagStore.flags]);

  const connectedExtensions = useMemo(() => {
    return getConnectedExtensions(
      assignedExtensions,
      online,
      enabledFeatureFlags
    );
  }, [assignedExtensions, online, enabledFeatureFlags]);

  return connectedExtensions;
}
