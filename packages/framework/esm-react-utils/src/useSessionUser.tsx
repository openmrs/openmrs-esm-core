/** @module @category API */
import { getCurrentUser, Session } from "@openmrs/esm-api";
import { useState, useEffect } from "react";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const sub = getCurrentUser({ includeAuthStatus: true }).subscribe(
      (session) => setSession(session)
    );

    return () => sub.unsubscribe();
  }, [setSession]);

  return session;
}

/** @deprecated */
// maintain alias for backwards compatibility
export const useSessionUser = useSession;
