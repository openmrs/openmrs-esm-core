import { cacheImportMapReferences } from "./caching";
import { ServiceWorkerDb } from "./storage";
import {
  MessageResult,
  OnImportMapChangedMessage,
  RegisterDynamicRouteMessage,
} from "./types";
import escapeRegExp from "lodash-es/escapeRegExp";

const messageHandlers = {
  onImportMapChanged,
  addDynamicRoute: registerDynamicRoute,
};

async function onImportMapChanged({ importMap }: OnImportMapChangedMessage) {
  await cacheImportMapReferences(importMap);
}

async function registerDynamicRoute({
  pattern,
  url,
}: RegisterDynamicRouteMessage) {
  let finalPattern = pattern;
  if (!finalPattern && url) {
    finalPattern = `^${escapeRegExp(url)}$`;
  }

  if (finalPattern) {
    const db = new ServiceWorkerDb();
    await db.dynamicRouteRegistrations.put({ pattern: finalPattern });
  }
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
      new Error(
        `Received an unknown message of type "${event.data?.type} which cannot be handled.`
      )
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
    fail(e);
  }

  function fail(error: Error) {
    console.warn("Handling a message resulted in an error.", error);
    resolve({
      success: false,
      error: error,
    });
  }

  function resolve<T>(result: MessageResult<T>) {
    event.ports[0].postMessage(result ?? {});
  }
}
