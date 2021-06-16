import React from "react";
import styles from "./root.scss";
import Navbar from "./components/navbar/navbar.component";
import { BrowserRouter, Redirect } from "react-router-dom";
import { LoggedInUser, createErrorHandler } from "@openmrs/esm-framework";
import { UserSession } from "./types";
import { getCurrentSession, getSynchronizedCurrentUser } from "./root.resource";

export interface RootProps {}

const Root: React.FC<RootProps> = () => {
  const [user, setUser] = React.useState<LoggedInUser | null | false>(null);
  const [userSession, setUserSession] = React.useState<UserSession>(null);
  const [allowedLocales, setAllowedLocales] = React.useState();
  const logout = React.useCallback(() => setUser(false), []);
  const openmrsSpaBase = window["getOpenmrsSpaBase"]();

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
