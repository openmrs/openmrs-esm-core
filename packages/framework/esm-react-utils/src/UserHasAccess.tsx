/** @module @category API */
import type { LoggedInUser } from '@openmrs/esm-api';
import { getCurrentUser, userHasAccess } from '@openmrs/esm-api';
import React, { useEffect, useState } from 'react';

export interface UserHasAccessProps {
  privilege: string | string[];
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * A React component that renders its children only if the current user exists and has the privilege(s)
 * specified by the `privilege` prop. This can be used not to render certain components when the user
 * doesn't have the permission to use this.
 *
 * Note that for top-level extensions (i.e., the component that's the root of the extension), you don't
 * need to use this component. Instead, when registering the extension, declare the required privileges
 * as part of the extension registration. This is for use deeper in extensions or other components where
 * a separate permission check might be needed.
 *
 * This can also be used to hide components when the current user is not logged in.
 *
 * @example
 * ```ts
 * <Form>
 *   <UserHasAccess privilege='Form Finallizer'>
 *     <Checkbox id="finalize-form" value={formFinalized} onChange={handleChange} />
 *   </UserHasAccess>
 * </Form>
 * ````
 *
 * @param props.privilege Either a string for a single required privilege or an array of strings for a
 *   set of required privileges. Note that sets of required privileges must all be matched.
 * @param props.fallback What to render if the user does not have access or if the user is not currently
 *   logged in. If not provided, nothing will be rendered
 * @param props.children The children to be rendered only if the user is logged in and has the required
 *   privileges.
 */
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
