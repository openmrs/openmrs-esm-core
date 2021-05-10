import { refetchCurrentUser, User } from "@openmrs/esm-framework";
import Dexie, { Table } from "dexie";
import { postUserPropertiesOnline } from "./components/choose-locale/change-locale.resource";
import { LoggedInUser } from "./types";

/**
 * Synchronizes pending user property changes with the backend.
 * @param loggedInUser The currently logged in user.
 * @param abortController An optional `AbortController` to cancel pending requests.
 */
export async function syncUserPropertiesChanges(
  loggedInUser: LoggedInUser,
  abortController?: AbortController
) {
  const db = new PrimaryNavigationDb();
  const queuedChangeEntries = await db.userPropertiesChanges
    .where({ userUuid: loggedInUser.uuid })
    .toArray();

  if (queuedChangeEntries.length > 0) {
    const queuedChanges = queuedChangeEntries.map((entry) => entry.changes);
    const newUserProperties = Object.assign(
      loggedInUser.userProperties,
      ...queuedChanges
    );
    await postUserPropertiesOnline(
      loggedInUser.uuid,
      newUserProperties,
      abortController
    );
    refetchCurrentUser();
    await db.userPropertiesChanges.bulkDelete(
      queuedChangeEntries.map((change) => change.id)
    );
    refetchCurrentUser();
  }
}

/**
 * Stores offline data of the primary navigation MF.
 */
export class PrimaryNavigationDb extends Dexie {
  userPropertiesChanges: Table<UserPropertiesChange, number>;

  constructor() {
    super("EsmPrimaryNavigation");

    this.version(1).stores({
      userPropertiesChanges: "++id,userUuid",
    });

    this.userPropertiesChanges = this.table("userPropertiesChanges");
  }
}

/**
 * An entity storing a change of a logged in a user's properties.
 */
export interface UserPropertiesChange {
  id?: number;
  userUuid: string;
  changes: Pick<User, "userProperties">;
}
