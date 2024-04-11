import { type LoggedInUser } from '@openmrs/esm-framework';

export function getUpdatedUserLoggedInLocations(
  previousLoggedInLocations: string,
  selectedLocationUuid: string,
): string {
  const prevLoggedInLocations = previousLoggedInLocations?.split(',') ?? [];
  const updatedLoggedInLocations = [
    selectedLocationUuid,
    ...prevLoggedInLocations?.filter((uuid) => uuid !== selectedLocationUuid),
  ];
  return updatedLoggedInLocations.join(',');
}

export function getUserDefaultAndLoggedInLocations(selectedLocationUuid: string, previousLoggedInLocations: string) {
  const updatedLoggedInLocations = getUpdatedUserLoggedInLocations(previousLoggedInLocations, selectedLocationUuid);
  const updatedUserProperties: LoggedInUser['userProperties'] = {
    previousLoggedInLocations: updatedLoggedInLocations,
    defaultLocation: selectedLocationUuid,
  };
  return updatedUserProperties;
}
