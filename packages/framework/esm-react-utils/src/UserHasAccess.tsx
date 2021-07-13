import React from "react";
import { userHasAccess } from "@openmrs/esm-user";
import { useCurrentUser } from "./useCurrentUser";

export interface UserHasAccessProps {
  privilege: string;
}

export const UserHasAccess: React.FC<UserHasAccessProps> = ({
  privilege,
  children,
}) => {
  const user = useCurrentUser();

  if (user && userHasAccess(privilege, user)) {
    return <>{children}</>;
  }

  return null;
};
