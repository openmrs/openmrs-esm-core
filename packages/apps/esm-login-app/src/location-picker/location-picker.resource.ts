import { type LoggedInUser } from '@openmrs/esm-framework';

export function getUpdatedLoggedInLocations(previousLoggedInLocations: string, locationUuid: string): string {
  const prevLoggedInLocations = previousLoggedInLocations?.split(',') ?? [];
  const updatedLoggedInLocations = [locationUuid, ...prevLoggedInLocations?.filter((uuid) => uuid !== locationUuid)];
  return updatedLoggedInLocations.join(',');
}

export function getUserPropertiesWithDefaultAndLogInLocation(locationUuid: string, previousLoggedInLocations: string) {
  const updatedLoggedInLocations = getUpdatedLoggedInLocations(previousLoggedInLocations, locationUuid);
  const updatedUserProperties: LoggedInUser['userProperties'] = {
    previousLoggedInLocations: updatedLoggedInLocations,
    defaultLocation: locationUuid,
  };
  return updatedUserProperties;
}
