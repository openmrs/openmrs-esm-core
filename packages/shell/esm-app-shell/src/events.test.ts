// `getCurrentUser()` hands a new subscriber the session store's current state during `subscribe()`, so
// an already-authenticated session arrives before `subscribe()` returns. This file pins what has to hold
// on that synchronous first emission, which is where naming the subscription in order to stop it from
// inside its own callback used to fail — the binding is still in its temporal dead zone, and the throw
// took `setupOptionalDependencies()` with it. ES5 output hid the whole thing behind `var` hoisting.
import { describe, expect, it, vi } from 'vitest';

const harness = vi.hoisted(() => ({
  startedHandlers: [] as Array<() => void>,
  setupCount: 0,
  teardownCount: 0,
  pushSession: null as null | ((session: { authenticated: boolean }) => void),
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
        subscriber.next({ authenticated: true });
        harness.pushSession = (session) => subscriber.next(session);

        return () => {
          harness.teardownCount++;
        };
      }),
  };
});

describe('the started event', () => {
  it('sets up optional dependencies once, and stops listening, on a synchronous session', async () => {
    await import('./events');
    harness.startedHandlers.forEach((handler) => handler());

    // Reading the subscription during this emission throws, which is what left the app shell showing an
    // error and no optional dependencies registered.
    expect(harness.setupCount).toBe(1);
    expect(harness.teardownCount).toBe(1);

    // And the run under ES5 output, where the failed `unsubscribe()` let a later session set up again.
    harness.pushSession?.({ authenticated: true });
    expect(harness.setupCount).toBe(1);
  });
});
