import { LoggedInUser } from "@openmrs/esm-api";

export function userHasPrivilege(
  requiredPrivilege: string,
  user: LoggedInUser
) {
  return user.privileges.find((p) => requiredPrivilege === p.display);
}

export function isSuperUser(user: LoggedInUser) {
  const superUserRole = "System Developer";
  return user.roles.find((role) => role.display === superUserRole);
}

export function userHasAccess(requiredPrivilege: string, user: LoggedInUser) {
  return userHasPrivilege(requiredPrivilege, user) || isSuperUser(user);
}
