/** @module @category API */
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-api';
import type { UploadedFile } from './types';

/** Base URL for the attachment REST API endpoint. */
export const attachmentUrl = `${restBaseUrl}/attachment`;

/**
 * Fetches a single attachment by its UUID from the OpenMRS server.
 *
 * @param attachmentUuid The UUID of the attachment to fetch.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the FetchResponse containing the attachment data.
 *
 * @example
 * ```ts
 * import { getAttachmentByUuid } from '@openmrs/esm-framework';
 * const abortController = new AbortController();
 * const response = await getAttachmentByUuid('attachment-uuid', abortController);
 * console.log(response.data);
 * ```
 */
export function getAttachmentByUuid(attachmentUuid: string, abortController: AbortController) {
  return openmrsFetch(`${attachmentUrl}/${attachmentUuid}`, {
    signal: abortController.signal,
  });
}

/**
 * Fetches all attachments for a specific patient from the OpenMRS server.
 *
 * @param patientUuid The UUID of the patient whose attachments should be fetched.
 * @param includeEncounterless Whether to include attachments that are not associated
 *   with any encounter.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the FetchResponse containing an array of attachments.
 *
 * @example
 * ```ts
 * import { getAttachments } from '@openmrs/esm-framework';
 * const abortController = new AbortController();
 * const response = await getAttachments('patient-uuid', true, abortController);
 * console.log(response.data.results);
 * ```
 */
export function getAttachments(patientUuid: string, includeEncounterless: boolean, abortController: AbortController) {
  return openmrsFetch(`${attachmentUrl}?patient=${patientUuid}&includeEncounterless=${includeEncounterless}`, {
    signal: abortController.signal,
  });
}

/**
 * Creates a new attachment for a patient by uploading a file to the OpenMRS server.
 * The file can be provided either as a File object or as base64-encoded content.
 *
 * @param patientUuid The UUID of the patient to associate the attachment with.
 * @param fileToUpload An object containing the file data and metadata to upload.
 *   Should include `file` (File object) or `base64Content`, plus `fileName` and
 *   `fileDescription`.
 * @returns A Promise that resolves with the FetchResponse containing the created
 *   attachment data.
 *
 * @example
 * ```ts
 * import { createAttachment } from '@openmrs/esm-framework';
 * const response = await createAttachment('patient-uuid', {
 *   file: selectedFile,
 *   fileName: 'document.pdf',
 *   fileDescription: 'Patient consent form'
 * });
 * ```
 */
export async function createAttachment(patientUuid: string, fileToUpload: UploadedFile) {
  const formData = new FormData();

  formData.append('fileCaption', fileToUpload.fileDescription);
  formData.append('patient', patientUuid);

  if (fileToUpload.file) {
    formData.append('file', fileToUpload.file, fileToUpload.fileName);
  } else {
    formData.append('file', new File([''], fileToUpload.fileName), fileToUpload.fileName);
    formData.append('base64Content', fileToUpload.base64Content);
  }

  return openmrsFetch(`${attachmentUrl}`, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Permanently deletes an attachment from the OpenMRS server. This action cannot
 * be undone.
 *
 * @param attachmentUuid The UUID of the attachment to delete.
 * @param abortController An AbortController to allow cancellation of the request.
 * @returns A Promise that resolves with the FetchResponse confirming deletion.
 *
 * @example
 * ```ts
 * import { deleteAttachmentPermanently } from '@openmrs/esm-framework';
 * const abortController = new AbortController();
 * await deleteAttachmentPermanently('attachment-uuid', abortController);
 * ```
 */
export function deleteAttachmentPermanently(attachmentUuid: string, abortController: AbortController) {
  return openmrsFetch(`${attachmentUrl}/${attachmentUuid}`, {
    method: 'DELETE',
    signal: abortController.signal,
  });
}
