import React, { useCallback, useEffect, useState } from "react";
import styles from "./root.scss";
import Navbar from "./components/navbar/navbar.component";
import { BrowserRouter, Redirect } from "react-router-dom";
import { LoggedInUser, createErrorHandler } from "@openmrs/esm-framework";
import { getCurrentSession, getSynchronizedCurrentUser } from "./root.resource";
import { UserSession } from "./types";

export interface RootProps {}

const Root: React.FC<RootProps> = () => {
  const [user, setUser] = useState<LoggedInUser | null | false>(null);
  const [userSession, setUserSession] = useState<UserSession>(null);
  const [allowedLocales, setAllowedLocales] = useState();
  const logout = useCallback(() => setUser(false), []);
  const openmrsSpaBase = window["getOpenmrsSpaBase"]();

  useEffect(() => {
    const currentUserSub = getSynchronizedCurrentUser({
      includeAuthStatus: true,
    }).subscribe((response) => {
      setAllowedLocales(response["allowedLocales"]);
      if (response.authenticated) {
        setUser(response.user);
      } else {
        setUser(false);
      }

      createErrorHandler();
    });

    const currentSessionSub = getCurrentSession().subscribe(({ data }) =>
      setUserSession(data)
    );

    return () => {
      currentUserSub.unsubscribe();
      currentSessionSub.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <div className={styles.primaryNavContainer}>
        {user === false ? (
          <Redirect
            to={{
              pathname: `${openmrsSpaBase}login`,
              state: {
                referrer: window.location.pathname.slice(
                  window.location.pathname.indexOf(openmrsSpaBase) +
                    openmrsSpaBase.length -
                    1
                ),
              },
            }}
          />
        ) : (
          user && (
            <Navbar
              allowedLocales={allowedLocales}
              user={user}
              onLogout={logout}
              session={userSession}
            />
          )
        )}
      </div>
    </BrowserRouter>
  );
};

export default Root;
