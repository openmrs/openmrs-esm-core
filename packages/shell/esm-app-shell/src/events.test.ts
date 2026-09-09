// `getCurrentUser()` hands a new subscriber the session store's current state during `subscribe()`, so
// its first emission arrives before `subscribe()` returns, and is usually an unauthenticated session.
// Both of those shape the code under test: the first is why the subscription cannot be stopped by name
// from inside its own callback, and the second is why the authenticated filter has to run before
// `take(1)`. These pin optional dependencies being set up exactly once, on the first authenticated
// session, whichever emission that turns out to be.
import { describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  startedHandlers: [] as Array<() => void>,
  setupCount: 0,
  teardownCount: 0,
  pushSession: null as null | ((session: { authenticated: boolean }) => void),
  /** What the store already holds when a subscriber arrives, emitted synchronously. */
  initialSession: { authenticated: true },
}));

vi.mock('./optionaldeps', () => ({
  setupOptionalDependencies: () => {
    harness.setupCount++;
  },
}));

vi.mock('@openmrs/esm-framework/src/internal', async () => {
  const { Observable } = await import('rxjs');

  return {
    cleanupObsoleteFeatureFlags: () => {},
    subscribeOpenmrsEvent: (name: string, handler: () => void) => {
      if (name === 'started') {
        harness.startedHandlers.push(handler);
      }
    },
    // Mirrors `current-user.ts`, which calls its store handler before returning the teardown.
    getCurrentUser: () =>
      new Observable<{ authenticated: boolean }>((subscriber) => {
        harness.pushSession = (session) => subscriber.next(session);
        subscriber.next(harness.initialSession);

        return () => {
          harness.teardownCount++;
        };
      }),
  };
});

/** Imports `events.ts` fresh and fires the `started` handlers it registered. */
async function startAppShell() {
  vi.resetModules();
  harness.startedHandlers.length = 0;
  harness.setupCount = 0;
  harness.teardownCount = 0;
  harness.pushSession = null;

  await import('./events');
  harness.startedHandlers.forEach((handler) => handler());
}

describe('the started event', () => {
  it('sets up optional dependencies once when the session is authenticated already', async () => {
    harness.initialSession = { authenticated: true };
    await startAppShell();

    // Reading the subscription during this emission throws, which left the app shell showing an error
    // and no optional dependencies registered.
    expect(harness.setupCount).toBe(1);
    expect(harness.teardownCount).toBe(1);

    harness.pushSession?.({ authenticated: true });
    expect(harness.setupCount).toBe(1);
  });

  it('waits for authentication when the first session is anonymous', async () => {
    // The ordinary startup path. With `take(1)` ahead of the filter this emission is consumed and
    // nothing is ever set up.
    harness.initialSession = { authenticated: false };
    await startAppShell();

    expect(harness.setupCount).toBe(0);
    expect(harness.teardownCount).toBe(0);

    harness.pushSession?.({ authenticated: false });
    expect(harness.setupCount).toBe(0);

    harness.pushSession?.({ authenticated: true });
    expect(harness.setupCount).toBe(1);
    expect(harness.teardownCount).toBe(1);

    // And it stops listening, rather than setting up again on every later session update.
    harness.pushSession?.({ authenticated: true });
    expect(harness.setupCount).toBe(1);
  });
});
