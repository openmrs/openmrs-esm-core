import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openmrsFetch } from '@openmrs/esm-api';
import { attachmentUrl, createAttachment, getAttachments, getAttachmentsUrl } from './attachments';

vi.mock('@openmrs/esm-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@openmrs/esm-api')>()),
  openmrsFetch: vi.fn(),
}));

const mockOpenmrsFetch = vi.mocked(openmrsFetch);

describe('getAttachmentsUrl', () => {
  it('filters by patient and includeEncounterless by default', () => {
    expect(getAttachmentsUrl('patient-uuid', true)).toBe(
      `${attachmentUrl}?patient=patient-uuid&includeEncounterless=true`,
    );
    expect(getAttachmentsUrl('patient-uuid', false)).toBe(
      `${attachmentUrl}?patient=patient-uuid&includeEncounterless=false`,
    );
  });

  it('filters by encounter and drops includeEncounterless when an encounter is given', () => {
    expect(getAttachmentsUrl('patient-uuid', true, 'encounter-uuid')).toBe(
      `${attachmentUrl}?patient=patient-uuid&encounter=encounter-uuid`,
    );
  });
});

describe('getAttachments', () => {
  beforeEach(() => {
    mockOpenmrsFetch.mockReset();
  });

  it('requests the patient attachments', () => {
    const abortController = new AbortController();
    getAttachments('patient-uuid', true, abortController);

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${attachmentUrl}?patient=patient-uuid&includeEncounterless=true`, {
      signal: abortController.signal,
    });
  });

  it('requests only the attachments on an encounter when one is given', () => {
    const abortController = new AbortController();
    getAttachments('patient-uuid', true, abortController, 'encounter-uuid');

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(`${attachmentUrl}?patient=patient-uuid&encounter=encounter-uuid`, {
      signal: abortController.signal,
    });
  });
});

describe('createAttachment', () => {
  const file = new File(['content'], 'photo.png', { type: 'image/png' });

  beforeEach(() => {
    mockOpenmrsFetch.mockReset();
  });

  function submittedFormData(): FormData {
    const [, options] = mockOpenmrsFetch.mock.calls[0];
    return options.body as FormData;
  }

  it('posts the file, caption and patient', async () => {
    await createAttachment('patient-uuid', {
      file,
      base64Content: '',
      fileName: 'photo.png',
      fileType: 'image/png',
      fileDescription: 'Wound photo',
    });

    expect(mockOpenmrsFetch).toHaveBeenCalledWith(attachmentUrl, expect.objectContaining({ method: 'POST' }));
    const formData = submittedFormData();
    expect(formData.get('patient')).toBe('patient-uuid');
    expect(formData.get('fileCaption')).toBe('Wound photo');
    expect(formData.get('file')).toBeInstanceOf(File);
    expect(formData.has('encounter')).toBe(false);
    expect(formData.has('base64Content')).toBe(false);
  });

  it('records the attachment on the encounter when one is given', async () => {
    await createAttachment(
      'patient-uuid',
      { file, base64Content: '', fileName: 'photo.png', fileType: 'image/png', fileDescription: 'Wound photo' },
      'encounter-uuid',
    );

    expect(submittedFormData().get('encounter')).toBe('encounter-uuid');
  });

  it('sends base64 content with a placeholder file when no File is given', async () => {
    await createAttachment('patient-uuid', {
      base64Content: 'data:image/png;base64,AAAA',
      fileName: 'capture.png',
      fileType: 'image/png',
      fileDescription: 'Webcam capture',
    });

    const formData = submittedFormData();
    expect(formData.get('base64Content')).toBe('data:image/png;base64,AAAA');
    expect((formData.get('file') as File).name).toBe('capture.png');
  });
});
