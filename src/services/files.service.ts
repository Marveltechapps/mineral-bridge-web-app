import { api, UPLOAD_TIMEOUT_MS } from '../api';
import type { FilePurpose, FileUrl, UploadedFile } from '../api';

export interface UploadOptions {
  /** Override the file name sent to the server (defaults to the File's own name). */
  fileName?: string;
  signal?: AbortSignal;
}

/**
 * POST /files (multipart: `file` + `purpose`). Returns the stored file (`fileId` is what other endpoints take).
 * `file` is a browser `File` / `Blob` (e.g. from an `<input type="file">`).
 */
export function uploadFile(file: File | Blob, purpose: FilePurpose, options: UploadOptions = {}): Promise<UploadedFile> {
  const name = options.fileName ?? (file instanceof File ? file.name : 'upload.bin');
  const form = new FormData();
  form.append('purpose', purpose);
  form.append('file', file, name);
  return api.post<UploadedFile>('/files', form, { timeoutMs: UPLOAD_TIMEOUT_MS, signal: options.signal });
}

/** GET /files/:fileId/url - short-lived signed URL (2 min for KYC, 15 min otherwise). */
export const getFileUrl = (fileId: string, signal?: AbortSignal): Promise<FileUrl> =>
  api.get<FileUrl>(`/files/${encodeURIComponent(fileId)}/url`, { signal });
