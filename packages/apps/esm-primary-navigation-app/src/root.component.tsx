import React from "react";
import styles from "./root.scss";
import Navbar from "./components/navbar/navbar.component";
import { BrowserRouter, Redirect } from "react-router-dom";
import { useCurrentUserSession } from "@openmrs/esm-framework";
import { useSynchronizedCurrentUser } from "./root.resource";

export interface RootProps {}

const Root: React.FC<RootProps> = () => {
  const session = useCurrentUserSession();
  const user = useSynchronizedCurrentUser(session?.user);

  return (
    <BrowserRouter basename={window.spaBase}>
      <div className={styles.primaryNavContainer}>
        {!user ? (
          <Redirect
            to={{
              pathname: `login`,
              state: {
                referrer: window.location.pathname.substr(
                  window.location.pathname.indexOf(window.spaBase) +
                    window.spaBase.length
                ),
              },
            }}
          />
        ) : (
          <Navbar
            allowedLocales={session?.allowedLocals}
            user={user}
            session={session}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

export default Root;
