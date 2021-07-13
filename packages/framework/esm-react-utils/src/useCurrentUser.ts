import { useState, useEffect } from "react";
import { LoggedInUser } from "@openmrs/esm-api";
import { subscribeCurrentUser } from "@openmrs/esm-user";

export function useCurrentUser() {
  const [user, setUser] = useState<LoggedInUser | undefined>();

  useEffect(() => subscribeCurrentUser(setUser), []);

  return user;
}
