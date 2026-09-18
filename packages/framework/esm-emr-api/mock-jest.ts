export const setCurrentVisit = jest.fn();
export const attachmentUrl = '/ws/rest/v1/attachment';
export const getAttachmentByUuid = jest.fn();
export const getAttachments = jest.fn();
export const getAttachmentsUrl = jest.fn(
  (patientUuid: string, includeEncounterless: boolean, encounterUuid?: string) =>
    encounterUuid
      ? `${attachmentUrl}?patient=${patientUuid}&encounter=${encounterUuid}`
      : `${attachmentUrl}?patient=${patientUuid}&includeEncounterless=${includeEncounterless}`,
);
export const createAttachment = jest.fn();
export const deleteAttachmentPermanently = jest.fn();
export const updateVisit = jest.fn();
export const saveVisit = jest.fn();
export const getVisitsForPatient = jest.fn();
export const getStartedVisit = jest.fn();
