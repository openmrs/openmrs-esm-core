import { ImportMap } from "@openmrs/esm-globals";
import { cacheImportMapReferences } from "./caching";

/**
 * The Service Worker's `message` event handler.
 * Matches the message's type/format to a specific handler.
 * @param event The event data containing the message dispatched to the Service Worker.
 */
export function handleMessage(event: ExtendableMessageEvent) {
  switch (event.data?.type?.toString() ?? "") {
    case "importMap":
      onImportMap(event.data?.importMap);
      break;
    default:
      console.warn(
        "The Service Worker received a message event with an unexpected format which cannot be handled.",
        event
      );
      break;
  }
}

async function onImportMap(importMap: ImportMap = { imports: {} }) {
  try {
    await cacheImportMapReferences(importMap);
  } catch (e) {
    console.error(
      "The Service Worker failed to cache the specified import map. See the error for details.",
      e
    );
  }
}
