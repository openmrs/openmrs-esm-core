import React, { useEffect } from "react";
import styles from "./root.scss";
import Navbar from "./components/navbar/navbar.component";
import { BrowserRouter, Redirect } from "react-router-dom";
import { createErrorHandler } from "@openmrs/esm-framework";
import { LoggedInUser, UserSession } from "./types";
import { getCurrentSession, getSynchronizedCurrentUser } from "./root.resource";
import { syncUserPropertiesChanges } from "./offline";

export interface RootProps {
  syncUserPropertiesChangesOnLoad: boolean;
}

const Root: React.FC<RootProps> = ({ syncUserPropertiesChangesOnLoad }) => {
  const [user, setUser] = React.useState<LoggedInUser | null | false>(null);
  const [userSession, setUserSession] = React.useState<UserSession>(null);
  const [allowedLocales, setAllowedLocales] = React.useState();
  const logout = React.useCallback(() => setUser(false), []);
  const openmrsSpaBase = window["getOpenmrsSpaBase"]();

  useEffect(() => {
    const abortController = new AbortController();

    if (syncUserPropertiesChangesOnLoad && user) {
      syncUserPropertiesChanges(user, abortController);
    }

    return () => abortController.abort();
  }, [syncUserPropertiesChangesOnLoad, user]);

  React.useEffect(() => {
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
