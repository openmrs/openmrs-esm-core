// The session store does not call a new listener during `subscribe()`, so `events.ts` has to read the
// current state itself afterwards. That is why an already-authenticated session is handled by the
// explicit `handle(store.getState())` call rather than by the subscription. These pin optional
// dependencies being set up exactly once, on the first authenticated session, whichever path it
// arrives by, and the subscription being dropped once that happens.
import { describe, expect, it, vi } from 'vitest';

interface SessionState {
  loaded: boolean;
  session: { authenticated: boolean };
}

const harness = vi.hoisted(() => ({
  startedHandlers: [] as Array<() => void>,
  setupCount: 0,
  teardownCount: 0,
  pushSession: null as null | ((session: { authenticated: boolean }) => void),
  /** What the store already holds when a subscriber arrives. */
  initialSession: { authenticated: true },
}));

vi.mock('./optionaldeps', () => ({
  setupOptionalDependencies: () => {
    harness.setupCount++;
  },
}));

vi.mock('@openmrs/esm-framework/src/internal', () => ({
  cleanupObsoleteFeatureFlags: () => {},
  subscribeOpenmrsEvent: (name: string, handler: () => void) => {
    if (name === 'started') {
      harness.startedHandlers.push(handler);
    }
  },
  getSessionStore: () => {
    let state: SessionState = { loaded: true, session: harness.initialSession };
    const listeners = new Set<(state: SessionState) => void>();

    harness.pushSession = (session) => {
      state = { loaded: true, session };
      listeners.forEach((listener) => listener(state));
    };

    return {
      getState: () => state,
      subscribe: (listener: (state: SessionState) => void) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
          harness.teardownCount++;
        };
      },
    };
  },
}));

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

    expect(harness.setupCount).toBe(1);
    expect(harness.teardownCount).toBe(1);

    harness.pushSession?.({ authenticated: true });
    expect(harness.setupCount).toBe(1);
  });

  it('waits for authentication when the first session is anonymous', async () => {
    // The ordinary startup path: the app shell starts before anyone has logged in.
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
