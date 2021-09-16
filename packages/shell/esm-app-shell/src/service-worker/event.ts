import type { KnownOmrsServiceWorkerEvents } from "@openmrs/esm-offline";

export async function publishEvent(event: KnownOmrsServiceWorkerEvents) {
  const clients = await self.clients.matchAll({ type: "window" });

  for (const client of clients) {
    client.postMessage(event);
  }
}
