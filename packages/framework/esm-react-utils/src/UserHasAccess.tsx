/** @module @category API */
import type { LoggedInUser } from '@openmrs/esm-api';
import { getCurrentUser, userHasAccess } from '@openmrs/esm-api';
import React, { useEffect, useState } from 'react';

export interface UserHasAccessProps {
  privilege: string | string[];
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const UserHasAccess: React.FC<UserHasAccessProps> = ({ privilege, fallback, children }) => {
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
    return fallback ? <>{fallback}</> : null;
  }
};
