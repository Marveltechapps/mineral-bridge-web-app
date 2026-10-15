/** Formatting helpers transcribed from the source design's logic layer. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2410` -> `$2,410.00`. */
export const money = (n: number): string =>
  '$' +
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** `2026-10-15` -> `15 Oct 2026`; anything unparseable renders as an em dash. */
export const formatDate = (d: string | undefined): string => {
  const parts = String(d || '').split('-');
  if (parts.length < 3) return '—';
  return `${parseInt(parts[2], 10)} ${MONTHS[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
};

/** Strip currency formatting down to a comparable number. */
export const num = (s: string | number): number =>
  parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

/** Status chip style used across negotiation, LC and bank screens. */
export const chipStyle = (bg: string, fg: string): string =>
  `display:inline-block; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 10px; border-radius:8px; white-space:nowrap; background:${bg}; color:${fg};`;
