import { vi } from 'vitest';

export const setCurrentVisit = vi.fn();
export const attachmentUrl = '/ws/rest/v1/attachment';
export const getAttachmentByUuid = vi.fn();
export const getAttachments = vi.fn();
export const getAttachmentsUrl = vi.fn((patientUuid: string, includeEncounterless: boolean, encounterUuid?: string) =>
  encounterUuid
    ? `${attachmentUrl}?patient=${patientUuid}&encounter=${encounterUuid}`
    : `${attachmentUrl}?patient=${patientUuid}&includeEncounterless=${includeEncounterless}`,
);
export const createAttachment = vi.fn();
export const deleteAttachmentPermanently = vi.fn();
export const updateVisit = vi.fn();
export const saveVisit = vi.fn();
export const getVisitsForPatient = vi.fn();
