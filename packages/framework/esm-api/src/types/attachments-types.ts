export interface UploadedFile {
  file?: File;
  base64Content: string;
  fileName: string;
  fileType: string;
  fileDescription: string;
  status?: 'uploading' | 'complete';
  capturedFromWebcam?: boolean;
}

export interface Attachment {
  id: string;
  src: string;
  filename: string;
  dateTime: string;
  bytesMimeType: string;
  bytesContentFamily: string;
  description?: string;
}

export interface AttachmentResponse {
  bytesContentFamily: string;
  bytesMimeType: string;
  comment: string;
  dateTime: string;
  uuid: string;
  filename?: string;
}
