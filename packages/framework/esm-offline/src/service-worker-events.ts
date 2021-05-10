export interface OmrsServiceWorkerEvent<TypeIdentifier extends string> {
  type: TypeIdentifier;
}

export interface NetworkRequestFailedEvent
  extends OmrsServiceWorkerEvent<"networkRequestFailed"> {
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
  };
}

export type KnownOmrsServiceWorkerEvents = NetworkRequestFailedEvent;
