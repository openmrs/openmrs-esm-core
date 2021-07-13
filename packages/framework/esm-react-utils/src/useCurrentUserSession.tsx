import { useState, useEffect } from "react";
import {
  subscribeCurrentUserSession,
  CurrentUserSession,
} from "@openmrs/esm-user";

export function useCurrentUserSession() {
  const [session, setSession] = useState<CurrentUserSession | undefined>();

  useEffect(() => subscribeCurrentUserSession(setSession), []);

  return session;
}
