import {
  getSynchronizationItemsFor,
  LoggedInUser,
} from "@openmrs/esm-framework";
import { useEffect, useState } from "react";
import { userPropertyChange } from "./constants";

/**
 * Returns the given user with all unsynchronized user property changes.
 */
export function useSynchronizedCurrentUser(user: LoggedInUser): LoggedInUser {
  const [changedUser, setChangedUser] = useState(user);

  useEffect(() => {
    let active = true;

    if (user) {
      getSynchronizationItemsFor<any>(user.uuid, userPropertyChange).then(
        (allChanges) => {
          const newUser = {
            ...user,
            userProperties: {
              ...user.userProperties,
            },
          };
          Object.assign(newUser.userProperties, ...allChanges);
          if (active) {
            setChangedUser(newUser);
          }
        }
      );
    } else {
      setChangedUser(user);
    }

    return () => {
      active = false;
    };
  }, [user]);

  return changedUser;
}
