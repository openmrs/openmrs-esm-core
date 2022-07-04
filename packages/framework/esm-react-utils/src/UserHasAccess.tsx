/** @module @category API */
import { getCurrentUser, LoggedInUser, userHasAccess } from "@openmrs/esm-api";
import React, { useEffect, useState } from "react";

interface UserHasAccessProps {
  privilege: string;
  unauthorisedResponse?: React.ReactNode | undefined;
}

export const UserHasAccess: React.FC<UserHasAccessProps> = ({
  privilege,
  unauthorisedResponse,
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
  } else {
    return unauthorisedResponse ? <>{unauthorisedResponse}</> : null;
  }
};
