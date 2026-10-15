/**
 * Inline SVG glyphs used throughout the design, reproduced exactly as authored
 * (same viewBox, stroke widths and path data) so they render identically.
 */

interface GlyphProps {
  size?: number;
  strokeWidth?: number;
}

const base = (size: number, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
});

/** Chain-link mark that accompanies "VERIFIED ON BLOCKCHAIN". */
export const ChainGlyph = ({ size = 12, strokeWidth = 2.4 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const CheckGlyph = ({ size = 13, strokeWidth = 3.2 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const PinGlyph = ({ size = 13, strokeWidth = 2 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const CartGlyph = ({ size = 19, strokeWidth = 2 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

export const ChevronGlyph = ({ size = 18, strokeWidth = 2 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const ArrowLeftGlyph = ({ size = 18, strokeWidth = 2 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const CloseGlyph = ({ size = 18, strokeWidth = 2.4 }: GlyphProps) => (
  <svg {...base(size, strokeWidth)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PlayGlyph = ({ size = 22 }: GlyphProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

export const PauseGlyph = ({ size = 22 }: GlyphProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

/** The small "VERIFIED ON BLOCKCHAIN" pill, reused on cards and panels. */
export const VerifiedPill = ({ style }: { style: React.CSSProperties }) => (
  <span style={style}>
    <ChainGlyph />
    VERIFIED ON BLOCKCHAIN
  </span>
);
