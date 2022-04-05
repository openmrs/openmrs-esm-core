/** @module @category Offline */
import type { ImportMap } from "@openmrs/esm-globals";
import { OmrsOfflineCachingStrategy } from "./service-worker-http-headers";
import { getOmrsServiceWorker } from "./service-worker";

/**
 * Sends the specified message to the application's service worker.
 * @param message The message to be sent.
 * @returns A promise which completes when the message has been successfully processed by the Service Worker.
 */
export async function messageOmrsServiceWorker(
  message: KnownOmrsServiceWorkerMessages
): Promise<MessageServiceWorkerResult<any>> {
  const sw = await getOmrsServiceWorker();
  return sw
    ? await sw.messageSW(message)
    : {
        success: false,
        result: undefined,
        error:
          "No service worker has been registered. This is typically the case when the application has been built without offline-related features.",
      };
}

export interface OmrsServiceWorkerMessage<
  MessageTypeTypeIdentifier extends string
> {
  type: MessageTypeTypeIdentifier;
}

export interface OnImportMapChangedMessage
  extends OmrsServiceWorkerMessage<"onImportMapChanged"> {
  importMap: ImportMap;
}

export interface ClearDynamicRoutesMessage
  extends OmrsServiceWorkerMessage<"clearDynamicRoutes"> {}

export interface RegisterDynamicRouteMessage
  extends OmrsServiceWorkerMessage<"registerDynamicRoute"> {
  pattern?: string;
  url?: string;
  strategy?: OmrsOfflineCachingStrategy;
}

export type KnownOmrsServiceWorkerMessages =
  | OnImportMapChangedMessage
  | ClearDynamicRoutesMessage
  | RegisterDynamicRouteMessage;

export interface MessageServiceWorkerResult<T> {
  success: boolean;
  result?: T;
  error?: string;
}
