import React, { useEffect, useState } from "react";
import { getCurrentUser, userHasAccess, LoggedInUser } from "@openmrs/esm-api";

export interface UserHasAccessProps {
  privilege: string;
}

export const UserHasAccess: React.FC<UserHasAccessProps> = ({
  privilege,
  children,
}) => {
  const [user, setUser] = useState<LoggedInUser | null>(null);

  useEffect(() => {
    const subscription = getCurrentUser({
      includeAuthStatus: false,
    }).subscribe(setUser);
    return () => subscription.unsubscribe();
  }, []);

  if (user && userHasAccess(privilege, user)) {
    return <>{children}</>;
  }

  return null;
};
