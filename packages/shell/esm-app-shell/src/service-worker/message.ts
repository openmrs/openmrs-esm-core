import type {
  MessageServiceWorkerResult,
  OnImportMapChangedMessage,
  RegisterDynamicRouteMessage,
  UpdateEncryptionKeyMessage
} from "@openmrs/esm-offline";
import escapeRegExp from "lodash-es/escapeRegExp";
import { cacheImportMapReferences } from "./caching";
import { DynamicRouteRegistration, ServiceWorkerDb } from "./storage";
import { setCryptoKey } from "@openmrs/esm-offline/src/encryption";

const messageHandlers = {
  onImportMapChanged,
  clearDynamicRoutes,
  registerDynamicRoute,
  updateEncryptionKey
};

async function onImportMapChanged({ importMap }: OnImportMapChangedMessage) {
  await cacheImportMapReferences(importMap);
}

async function clearDynamicRoutes() {
  await new ServiceWorkerDb().dynamicRouteRegistrations.clear();
}

async function registerDynamicRoute({
  pattern,
  url,
  strategy,
}: RegisterDynamicRouteMessage) {
  let finalPattern = pattern;
  if (!finalPattern && url) {
    finalPattern = `^${escapeRegExp(url)}$`;
  }

  if (finalPattern) {
    const registration: DynamicRouteRegistration = {
      pattern: finalPattern,
      strategy,
    };

    await new ServiceWorkerDb().dynamicRouteRegistrations.put(registration);
  }
}

async function updateEncryptionKey({
  password
}: UpdateEncryptionKeyMessage): Promise<CryptoKey> {
  let key = await setCryptoKey(password);
  return Promise.resolve(key);
}

/**
 * Invoked when the service worker receives a message.
 * Matches the message to a handler, invokes that handler and dispatches the result returned
 * by the handler back to the window.
 *
 * For this to work, the message needs to have a defined format.
 * @param event The event data containing the message dispatched to the Service Worker.
 */
export async function handleMessage(event: ExtendableMessageEvent) {
  const handler = messageHandlers[event.data?.type?.toString() ?? ""];

  if (!handler) {
    fail(
      `Received an unknown message of type "${event.data?.type} which cannot be handled.`
    );
    return;
  }

  try {
    const result = await handler(event.data);
    resolve({
      success: true,
      result,
    });
  } catch (e) {
    fail(e?.message ?? e?.toString() ?? "Unknown error.");
  }

  function fail(error: string) {
    console.warn("[SW] Handling a message resulted in an error.", error);
    resolve({
      success: false,
      error,
    });
  }

  function resolve<T>(result: MessageServiceWorkerResult<T>) {
    event.ports[0].postMessage(result ?? {});
  }
}
