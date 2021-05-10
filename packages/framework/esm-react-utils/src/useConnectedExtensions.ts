import { useMemo } from "react";
import {
  checkStatusFor,
  ExtensionRegistration,
  extensionStore,
  getExtensionRegistrationFrom,
} from "@openmrs/esm-extensions";
import { useAssignedExtensionIds } from "./useAssignedExtensionIds";
import { useConnectivity } from "./useConnectivity";

function isValidExtension(
  extension: ExtensionRegistration | undefined
): extension is ExtensionRegistration {
  return extension !== undefined;
}

/**
 * We have the following extension modes:
 *
 * - attached (set via code in form of: attach, detach, ...)
 * - configured (set via configuration in form of: added, removed, ...)
 * - assigned (computed from attached and configured)
 * - connected (computed from assigned using connectivity and online / offline)
 */

/**
 * Gets the assigned extension for a given extension slot name.
 * Considers if offline or online.
 * @param extensionSlotName The name of the slot to get the assigned extensions for.
 */
export function useConnectedExtensions(extensionSlotName: string) {
  const online = useConnectivity();
  const extensionIdsToRender = useAssignedExtensionIds(extensionSlotName);

  const extensions = useMemo(() => {
    const state = extensionStore.getState();
    return extensionIdsToRender
      .map((m) => getExtensionRegistrationFrom(state, m))
      .filter(isValidExtension)
      .filter((m) => checkStatusFor(online, m.online, m.offline));
  }, [extensionIdsToRender, online]);

  return extensions;
}
