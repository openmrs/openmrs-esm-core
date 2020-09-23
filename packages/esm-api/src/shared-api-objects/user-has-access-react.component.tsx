import React from "react";
import { getCurrentUser, userHasAccess } from "./current-user";
import { LoggedInUser } from "../types";

export interface UserHasAccessReactProps {
  privilege: string;
}

const UserHasAccessReact: React.FC<UserHasAccessReactProps> = ({
  privilege,
  children,
}) => {
  const [user, setUser] = React.useState<LoggedInUser | null>(null);

  React.useEffect(() => {
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

export default UserHasAccessReact;
