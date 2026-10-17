import { http } from '@/lib/api/client';

interface UploadTarget {
  fileId: string;
  upload: { url: string; headers?: Record<string, string> };
}

/** Registers a file, PUTs the bytes to the signed URL, and returns the file id. */
export async function uploadFile(file: File, purpose: string): Promise<string> {
  const created = await http.post<UploadTarget>('/uploads', {
    purpose,
    filename: file.name || 'upload',
    contentType: file.type || 'application/octet-stream',
    bytes: file.size,
  });
  const response = await fetch(created.upload.url, {
    method: 'PUT',
    headers: created.upload.headers,
    body: file,
  });
  if (!response.ok) throw new Error('The file could not be uploaded.');
  return created.fileId;
}

/** Opens the system file picker without adding a control to the page. */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}
