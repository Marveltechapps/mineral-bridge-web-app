/**
 * Small RFC 4122 v4 UUID helper (no dependency). Used for Idempotency-Key and device ids.
 * Prefers `crypto.randomUUID` / `crypto.getRandomValues` (browser Web Crypto); the Math.random fallback is adequate
 * for idempotency keys / device identifiers - never use it for secrets.
 */
type CryptoLike = { getRandomValues?: (a: Uint8Array) => Uint8Array; randomUUID?: () => string };

export function uuidv4(): string {
  const c = (globalThis as unknown as { crypto?: CryptoLike }).crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40; // version 4
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80; // variant 10
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) hex.push((bytes[i] ?? 0).toString(16).padStart(2, '0'));
  return (
    hex.slice(0, 4).join('') + '-' + hex.slice(4, 6).join('') + '-' + hex.slice(6, 8).join('') + '-' +
    hex.slice(8, 10).join('') + '-' + hex.slice(10, 16).join('')
  );
}
