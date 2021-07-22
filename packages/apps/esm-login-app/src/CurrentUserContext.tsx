import React, { useContext, useState, useMemo, useEffect } from "react";
import { getCurrentUser } from "@openmrs/esm-framework";

const CurrentUser = React.createContext<User>({
  current: undefined,
  setCurrent() {},
});

interface UserState {
  loading: boolean;
  current: LoggedInUser | undefined;
}

export interface User {
  current: LoggedInUser | undefined;
  setCurrent(user: LoggedInUser): void;
}

export interface ResourceRef {
  uuid: string;
  display: string;
  links: Array<any>;
}

export interface LoggedInUser {
  uuid: string;
  display: string;
  username: string;
  systemId: string;
  userProperties: any;
  person: ResourceRef;
  privileges: Array<ResourceRef>;
  roles: Array<ResourceRef>;
  retired: boolean;
  locale: string;
  allowedLocales: Array<string>;
}

export function useCurrentUser() {
  const value = useContext(CurrentUser);
  return value.current;
}

export const CurrentUserContext: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserState>({
    current: undefined,
    loading: true,
  });
  const value = useMemo(
    () => ({
      current: user.current,
      setCurrent: (current: LoggedInUser) =>
        setUser((state) => ({
          ...state,
          current,
        })),
    }),
    [user]
  );

  useEffect(() => {
    const sub = getCurrentUser({
      includeAuthStatus: true,
    }).subscribe(({ user }) =>
      setUser({
        current: user,
        loading: false,
      })
    );
    return () => sub.unsubscribe();
  }, []);

  return (
    <CurrentUser.Provider value={value}>
      {!user.loading && children}
    </CurrentUser.Provider>
  );
};
