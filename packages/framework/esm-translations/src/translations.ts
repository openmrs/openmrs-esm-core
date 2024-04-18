/** Please keep these alphebetized */

const addressFields = {
  address1: 'Address line 1',
  address2: 'Address line 2',
  city: 'City',
  cityVillage: 'City',
  country: 'Country',
  countyDistrict: 'District',
  postalCode: 'Postal code',
  state: 'State',
  stateProvince: 'State',
};

const workspaceTranslations = {
  closeAllOpenedWorkspaces: 'Discard changes in {{count}} workspaces',
  closingAllWorkspacesPromptBody:
    'There are unsaved changes in the following workspaces. Do you want to discard changes in the following workspaces? {{workspaceNames}}',
  closingAllWorkspacesPromptTitle: 'You have unsaved changes',
  discard: 'Discard',
  openAnyway: 'Open Anyway',
  unsavedChangesInOpenedWorkspace: `You have unsaved changes in the opened workspace. Do you want to discard these changes?`,
  unsavedChangesInWorkspace:
    'There are unsaved changes in {{workspaceName}}. Please save them before opening another workspace.',
  unsavedChangesTitleText: 'Unsaved Changes',
};

export const coreTranslations = {
  ...addressFields,
  ...workspaceTranslations,
  actions: 'Actions',
  address: 'Address',
  cancel: 'Cancel',
  change: 'Change',
  close: 'Close',
  confirm: 'Confirm',
  contactDetails: 'Contact Details',
  error: 'Error',
  errorCopy:
    'Sorry, there was a problem displaying this information. You can try to reload this page, or contact the site administrator and quote the error code above.',
  female: 'Female',
  hideDetails: 'Hide details',
  loading: 'Loading',
  male: 'Male',
  other: 'Other',
  patientLists: 'Patient Lists',
  relationships: 'Relationships',
  seeMoreLists: 'See {{count}} more lists',
  showDetails: 'Show details',
  unknown: 'Unknown',
};
