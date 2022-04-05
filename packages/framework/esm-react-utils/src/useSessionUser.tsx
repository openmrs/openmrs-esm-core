/** @module @category API */
import { openmrsObservableFetch, SessionUser } from "@openmrs/esm-api";
import { useState, useEffect } from "react";

export function useSessionUser() {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    if (sessionUser === null) {
      const sub = openmrsObservableFetch("/ws/rest/v1/session").subscribe(
        (user: any) => {
          setSessionUser(user.data);
        }
      );

      return () => sub.unsubscribe();
    }
  }, [sessionUser]);

  return sessionUser;
}
