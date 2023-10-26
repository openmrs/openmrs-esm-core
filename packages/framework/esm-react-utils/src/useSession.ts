/** @module @category API */
import { getSessionStore, Session } from "@openmrs/esm-api";
import { useState, useEffect } from "react";

let promise: undefined | Promise<Session>;
let unsubscribe: undefined | (() => void);

/**
 * Gets the current user session information. Returns an object with
 * property `authenticated` == `false` if the user is not logged in.
 *
 * Uses Suspense. This hook will always either return a Session object
 * or throw for Suspense. It will never return `null`/`undefined`.
 *
 * @returns Current user session information
 */
export function useSession(): Session {
  // We have two separate variables for the session.
  //
  // `session` is a temporary variable, which starts as `null` every time this
  // hook is executed. It is important that we can set and return this
  // variable synchronously, because every time we `throw` for Suspense, this
  // hook will unmount and a new instance will be created, destroying whatever
  // state existed. Thus, if this hook were to try to always set and return
  // `stateSession`, it would cause an infinite loop:
  //   1. instance A mounts
  //   2. instance A receives value, calls `setStateSession`
  //   3. instance A throws
  //   4. instance A unmounts
  //   5. instance B mounts
  //   ...
  // What would happen if we moved `session` to the module scope, so that it
  // could be re-used across instances of this hook? Then we would have no way
  // to tell whether the session was fresh.
  //
  // `stateSession` is React state, which is needed to update components using
  // this hook when the session changes.
  const [stateSession, setStateSession] = useState<Session | null>(null);
  let session: Session | null = null;

  if (!stateSession) {
    if (!promise) {
      // If we haven't created a promise to throw yet, do that.
      promise = new Promise<Session>((resolve) => {
        const handleNewSession = ({ loaded, session: newSession }) => {
          if (loaded) {
            resolve(newSession);
            session = newSession;
            unsubscribe && unsubscribe();
            unsubscribe = undefined;
          }
        };
        handleNewSession(getSessionStore().getState());
        if (!session) {
          unsubscribe = getSessionStore().subscribe(handleNewSession);
        }
      });
    } else {
      // However, if we have created a promise to throw, but there's no `stateSession`
      // yet, then it's probably just this hook's first render. Check to see if
      // there's already a session that we can return.
      const currentState = getSessionStore().getState();
      if (currentState.loaded) {
        session = currentState.session;
      }
    }

    // If the session got set synchronously in the above block, then we can just
    // return it rather than throwing. Otherwise, throw for Suspense.
    if (session) {
      setStateSession(session);
    } else {
      throw promise;
    }
  }

  // Once this hook is established (no longer throwing and getting re-created)
  // we need to set up a subscription that will update its value the good
  // old-fashioned React way.
  useEffect(() => {
    if (!unsubscribe) {
      unsubscribe = getSessionStore().subscribe(
        ({ loaded, session: newSession }) => {
          if (loaded) {
            session = newSession;
            setStateSession(newSession);
          }
        }
      );
    }
    return () => {
      unsubscribe && unsubscribe();
      unsubscribe = undefined;
    };
  }, []);

  const result = stateSession || session;
  if (!result) {
    if (promise) {
      console.warn(
        "useSession is in an unexpected state. Attempting to recover."
      );
      throw promise;
    } else {
      throw Error("useSession is in an invalid state.");
    }
  }
  return result;
}

/**
 * For testing.
 */
export function __cleanup() {
  promise = undefined;
  unsubscribe = undefined;
}
