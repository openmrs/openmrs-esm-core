import { ImportMap } from "@openmrs/esm-globals";
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
  return await sw.messageSW(message);
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
