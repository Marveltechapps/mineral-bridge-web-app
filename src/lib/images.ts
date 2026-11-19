/**
 * Product / category imagery. Bundled design images live in `public/assets/m4/<name>.png`; API items may instead carry
 * a remote `imageUrl`, which is used as-is.
 */
const BUNDLED = new Set([
  'hero-grain', 'gold-bullion', 'gold-dore', 'gold-biscuit', 'gold-dust', 'gold-concentrate', 'grain-shot',
  'm-silver', 'm-platinum', 'm-gold', 'cat-precious', 'cat-industrial', 'cat-critical', 'cat-gemstone',
  'banner-buy', 'logo-circle', 'mb-logo',
]);

export const hasImage = (name?: string | null): boolean => !!name && BUNDLED.has(name);

const isRemote = (s: string) => /^(https?:)?\/\//i.test(s) || s.startsWith('data:') || s.startsWith('blob:');

/**
 * Downscale a photo in the browser (longest side `maxSide`, JPEG `quality`). Returns the original file when it is not a
 * resizable raster image, is already small, or the browser cannot decode it (the server still validates the file).
 */
export async function compressImage(file: File, maxSide = 1800, quality = 0.82): Promise<File> {
  if (typeof document === 'undefined' || !/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    if (k >= 1 && file.size < 1.5 * 1048576) { bmp.close(); return file; }
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(bmp.width * k));
    c.height = Math.max(1, Math.round(bmp.height * k));
    c.getContext('2d')?.drawImage(bmp, 0, 0, c.width, c.height);
    bmp.close();
    const blob = await new Promise<Blob | null>(res => c.toBlob(res, 'image/jpeg', quality));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

/** CSS `url(...)` for a bundled image name or a remote URL. Unknown names fall back to the precious-metals image. */
export function imageUrl(name?: string | null): string {
  const n = name || '';
  if (isRemote(n)) return n;
  return `/assets/m4/${hasImage(n) ? n : 'cat-precious'}.png`;
}
