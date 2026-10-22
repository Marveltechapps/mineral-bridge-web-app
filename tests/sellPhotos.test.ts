import { describe, expect, it, vi } from 'vitest';
import type { SellPhoto } from '@/types';
import {
  dropHeldSellPhotoFile,
  holdSellPhotoFile,
  imageContentType,
  prepareSellPhotoUploads,
  sellPhotoFile,
  sellPhotoProblemMessage,
} from '@/features/sell/sellPhotoFiles';

function photo(partial: Partial<SellPhoto> & Pick<SellPhoto, 'id' | 'name'>): SellPhoto {
  return { previewUrl: '', ...partial };
}

describe('sell photo files', () => {
  it('treats a jpg with an empty or legacy type as jpeg', () => {
    expect(imageContentType({ name: '7.jpg', type: '' })).toBe('image/jpeg');
    expect(imageContentType({ name: '7.jpg', type: 'image/jpg' })).toBe('image/jpeg');
    expect(imageContentType({ name: 'side.png', type: '' })).toBe('image/png');
  });

  it('rebuilds a photo from its preview after the original file is dropped', async () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    holdSellPhotoFile('p-7', new File([bytes], '7.jpg', { type: 'image/jpeg' }));
    dropHeldSellPhotoFile('p-7');
    const fetchPreview = vi.fn(async (url: string) => {
      expect(url).toBe('blob:preview-7');
      return { ok: true, blob: async () => new Blob(['jpeg-bytes'], { type: 'image/jpeg' }) };
    });
    vi.stubGlobal('fetch', fetchPreview);

    const restored = await sellPhotoFile({ id: 'p-7', name: '7.jpg', previewUrl: 'blob:preview-7' });

    expect(fetchPreview).toHaveBeenCalledOnce();
    expect(restored).not.toBeNull();
    expect(restored?.name).toBe('7.jpg');
    expect(restored?.type).toBe('image/jpeg');
    expect(restored?.size).toBeGreaterThan(0);
    vi.unstubAllGlobals();
  });

  it('uploads every photo and names only the one that cannot be read', async () => {
    const upload = vi.fn(async (id: string) => `fil_${id}`);
    const bytes = new Uint8Array([1, 2, 3, 4]);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(new Blob([bytes], { type: 'image/jpeg' }))));
    const ready = photo({ id: 'kept', name: '1.jpg', fileId: 'fil_kept' });
    const recoverable = photo({ id: 'second', name: '2.jpg', previewUrl: 'blob:second' });
    const gone = photo({ id: 'missing', name: '7.jpg' });

    const prepared = await prepareSellPhotoUploads([ready, recoverable, gone], upload);

    expect(upload).toHaveBeenCalledTimes(1);
    expect(prepared.fileIds).toEqual(['fil_kept', 'fil_second']);
    expect(prepared.missing.map((item) => item.name)).toEqual(['7.jpg']);
    expect(sellPhotoProblemMessage(prepared.missing, prepared.failed)).toMatch(/7\.jpg is no longer available/);
    expect(sellPhotoProblemMessage(prepared.missing, prepared.failed)).toMatch(/other photos are unchanged/);
    vi.unstubAllGlobals();
  });

  it('keeps successful photos when one upload fails', async () => {
    const upload = vi.fn(async (id: string) => {
      if (id === 'bad') throw new Error('The file could not be uploaded.');
      return `fil_${id}`;
    });
    holdSellPhotoFile('good', new File([new Uint8Array([1])], '1.jpg', { type: 'image/jpeg' }));
    holdSellPhotoFile('bad', new File([new Uint8Array([2])], '7.jpg', { type: 'image/jpeg' }));

    const prepared = await prepareSellPhotoUploads(
      [photo({ id: 'good', name: '1.jpg' }), photo({ id: 'bad', name: '7.jpg' })],
      upload,
    );

    expect(prepared.fileIds).toEqual(['fil_good']);
    expect(prepared.failed).toEqual([
      { id: 'bad', name: '7.jpg', message: 'The file could not be uploaded.' },
    ]);
    expect(sellPhotoProblemMessage(prepared.missing, prepared.failed)).toMatch(/rest of this listing is unchanged/);
  });
});
