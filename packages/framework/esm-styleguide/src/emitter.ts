/**
 * A minimal multicast event emitter used internally by the styleguide's
 * notification, snackbar, and toast rendering hosts.
 *
 * It replaces the rxjs `Subject` these hosts previously relied on. Those usages
 * only ever needed `next()` to push a value and `subscribe()` to receive values
 * (returning something with `unsubscribe()`), so a tiny emitter lets the
 * framework drop its rxjs dependency entirely.
 */
export interface EmitterSubscription {
  unsubscribe(): void;
}

export class Emitter<T> {
  private listeners = new Set<(value: T) => void>();

  subscribe(listener: (value: T) => void): EmitterSubscription {
    this.listeners.add(listener);
    return {
      unsubscribe: () => {
        this.listeners.delete(listener);
      },
    };
  }

  next(value: T): void {
    // Iterate over a snapshot so a listener that unsubscribes while handling an
    // emission doesn't disturb the iteration.
    for (const listener of [...this.listeners]) {
      listener(value);
    }
  }
}
