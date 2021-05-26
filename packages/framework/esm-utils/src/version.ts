import * as semver from "semver";

export function isVersionSatisfied(
  requiredVersion: string,
  installedVersion: string
) {
  return semver.satisfies(installedVersion, requiredVersion, {
    includePrerelease: true,
  });
}
