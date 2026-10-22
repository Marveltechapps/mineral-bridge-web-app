import type { SellPhoto } from '@/types';

const heldFiles = new Map<string, File>();
const uploadedIds = new Map<string, string>();

/** The type the upload API accepts for a sell photo. */
export function imageContentType(file: { name: string; type: string }): string {
  const type = file.type.toLowerCase().split(';')[0].trim();
  if (type === 'image/jpg' || type === 'image/pjpeg') return 'image/jpeg';
  if (type === 'image/jpeg' || type === 'image/png') return type;
  if (/\.png$/i.test(file.name)) return 'image/png';
  if (/\.jpe?g$/i.test(file.name)) return 'image/jpeg';
  return type;
}

/** A File whose type is one the upload API accepts. */
export function asUploadableImage(file: File): File {
  const type = imageContentType(file);
  if (file.type === type) return file;
  return new File([file], file.name || 'photo', { type });
}

export function holdSellPhotoFile(id: string, file: File): void {
  heldFiles.set(id, file);
}

export function rememberedSellFileId(id: string): string | undefined {
  return uploadedIds.get(id);
}

export function rememberSellFileId(id: string, fileId: string): void {
  uploadedIds.set(id, fileId);
}

/** Drops the in-memory bytes only. The preview URL is left intact so the photo can be rebuilt. */
export function dropHeldSellPhotoFile(id: string): void {
  heldFiles.delete(id);
}

export function releaseSellPhoto(photo: Pick<SellPhoto, 'id' | 'previewUrl'> | undefined): void {
  if (!photo) return;
  heldFiles.delete(photo.id);
  uploadedIds.delete(photo.id);
  if (photo.previewUrl.startsWith('blob:')) URL.revokeObjectURL(photo.previewUrl);
}

/**
 * The bytes to upload for a selected photo.
 * Uses the original file, then the preview still shown on the page.
 */
export async function sellPhotoFile(photo: Pick<SellPhoto, 'id' | 'name' | 'previewUrl'>): Promise<File | null> {
  const held = heldFiles.get(photo.id);
  if (held && held.size > 0) return asUploadableImage(held);
  if (!photo.previewUrl) return null;
  try {
    const response = await fetch(photo.previewUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    if (blob.size <= 0) return null;
    const name = photo.name || 'photo.jpg';
    const type = imageContentType({ name, type: blob.type });
    if (type !== 'image/jpeg' && type !== 'image/png') return null;
    const body = typeof blob.arrayBuffer === 'function' ? await blob.arrayBuffer() : blob;
    const file = new File([body], name, { type });
    heldFiles.set(photo.id, file);
    return file;
  } catch {
    return null;
  }
}

export interface PreparedSellPhotos {
  fileIds: string[];
  saved: Array<{ id: string; fileId: string }>;
  missing: Array<{ id: string; name: string }>;
  failed: Array<{ id: string; name: string; message: string }>;
}

/** Resolves every selected photo to an uploaded file id, without dropping the ones that already succeeded. */
export async function prepareSellPhotoUploads(
  photos: SellPhoto[],
  upload: (photoId: string, file: File) => Promise<string>,
): Promise<PreparedSellPhotos> {
  const fileIds: string[] = [];
  const saved: PreparedSellPhotos['saved'] = [];
  const missing: PreparedSellPhotos['missing'] = [];
  const failed: PreparedSellPhotos['failed'] = [];

  for (const photo of photos) {
    const known = photo.fileId || rememberedSellFileId(photo.id);
    if (known) {
      fileIds.push(known);
      saved.push({ id: photo.id, fileId: known });
      continue;
    }
    const file = await sellPhotoFile(photo);
    if (!file) {
      missing.push({ id: photo.id, name: photo.name || 'A photo' });
      continue;
    }
    try {
      const fileId = await upload(photo.id, file);
      rememberSellFileId(photo.id, fileId);
      fileIds.push(fileId);
      saved.push({ id: photo.id, fileId });
    } catch (error: unknown) {
      failed.push({
        id: photo.id,
        name: photo.name || 'A photo',
        message: error instanceof Error ? error.message : 'The photo could not be uploaded.',
      });
    }
  }

  return { fileIds, saved, missing, failed };
}

export function sellPhotoProblemMessage(
  missing: Array<{ name: string }>,
  failed: Array<{ name: string; message: string }>,
): string | null {
  const parts: string[] = [];
  if (missing.length === 1) {
    parts.push(
      `${missing[0].name} is no longer available, so the listing was not submitted. The mineral, location, and your other photos are unchanged. Choose that photo again, then submit.`,
    );
  } else if (missing.length > 1) {
    parts.push(
      `${missing.map((photo) => photo.name).join(', ')} are no longer available, so the listing was not submitted. The mineral, location, and your other photos are unchanged. Choose those photos again, then submit.`,
    );
  }
  if (failed.length === 1) {
    parts.push(
      `${failed[0].name} could not be uploaded (${failed[0].message}). The rest of this listing is unchanged. Submit again to retry that photo.`,
    );
  } else if (failed.length > 1) {
    parts.push(
      `${failed.map((photo) => photo.name).join(', ')} could not be uploaded. The rest of this listing is unchanged. Submit again to retry those photos.`,
    );
  }
  return parts.length ? parts.join(' ') : null;
}
