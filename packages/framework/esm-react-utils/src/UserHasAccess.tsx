/** @module @category API */
import { getCurrentUser, LoggedInUser, userHasAccess } from "@openmrs/esm-api";
import { InlineNotification } from "carbon-components-react";
import React, { useEffect, useState } from "react";

export interface UserHasAccessProps {
  privilege: string;
  unauthorisedResponse?: string | undefined;
  redirectUrl?: string | undefined;
}

export const UserHasAccess: React.FC<UserHasAccessProps> = ({
  privilege,
  unauthorisedResponse,
  redirectUrl,
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

  if (unauthorisedResponse) {
    return (
      <div className="omrs-inline-notifications-container">
        <InlineNotification
          title="Unauthorised"
          subtitle={unauthorisedResponse}
          kind="error"
        />
      </div>
    );
  }

  if (redirectUrl) {
    window.location.replace(redirectUrl);
  }

  return null;
};
