import { type EventsWithPayload, type OpenmrsEvent, type EventsWithoutPayload, type EventTypes } from './types';
export { type OpenmrsEvent, type EventTypes as OpenmrsEventTypes } from './types';

export function fireOpenmrsEvent<T extends EventsWithoutPayload>(event: T, payload?: never): boolean;
export function fireOpenmrsEvent<T extends EventsWithPayload>(event: T, payload: EventTypes[T]): boolean;
/**
 * Fires an OpenMRS custom event
 *
 * @param event The custom event to fire
 * @param payload The payload associated with this type of event
 * @returns true if the event was not cancelled and false, i.e., the result of `dispatchEvent()`
 */
export function fireOpenmrsEvent<T extends OpenmrsEvent>(event: T, payload?: EventTypes[T]): boolean {
  const evt = new CustomEvent(`openmrs:${event}`, { detail: payload ?? undefined, cancelable: true, bubbles: true });
  return window.dispatchEvent(evt);
}

/**
 * Subscribes to a custom OpenMRS event
 *
 * @param event The name of the event to listen to
 * @param handler The callback to be called when the event fires
 */
export function subscribeOpenmrsEvent<T extends OpenmrsEvent>(
  event: T,
  handler: (payload?: EventTypes[T]) => boolean | void,
): () => void {
  const internalHandler = (event: Event) => {
    const detail = 'detail' in event && event.detail !== null ? event.detail : undefined;
    handler(detail as EventTypes[T]);
  };

  window.addEventListener(`openmrs:${event}`, internalHandler);
  return () => {
    window.removeEventListener(`openmrs:${event}`, internalHandler);
  };
}
