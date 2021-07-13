import { useState, useEffect } from "react";
import { LoggedInUser } from "@openmrs/esm-api";
import {
  subscribeCurrentUser,
  subscribeCurrentUserSession,
  CurrentUserSession,
} from "@openmrs/esm-user";

export function useCurrentUser() {
  const [user, setUser] = useState<LoggedInUser | undefined>();

  useEffect(() => subscribeCurrentUser(setUser), []);

  return user;
}

export function useCurrentUserSession() {
  const [session, setSession] = useState<CurrentUserSession | undefined>();

  useEffect(() => subscribeCurrentUserSession(setSession), []);

  return session;
}
