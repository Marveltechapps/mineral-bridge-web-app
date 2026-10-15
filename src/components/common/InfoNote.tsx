import type { ReactNode } from 'react';
import { css } from '@/utils/css';

/**
 * The bordered advisory notes the design uses on the wizards.
 *
 * Each variant below reproduces one of the three note treatments in the source
 * design exactly — they differ in padding, radius, icon size and type scale, so
 * they are enumerated rather than derived.
 */
export type InfoNoteVariant = 'hint' | 'amber' | 'amberCompact' | 'blue';

const VARIANTS: Record<
  InfoNoteVariant,
  { wrap: string; stroke: string; iconSize: number; text: string }
> = {
  hint: {
    wrap: 'display:flex; gap:9px; align-items:flex-start; background:#eff4ff; border:1px solid #dbe4ff; border-radius:12px; padding:12px 14px;',
    stroke: '#2563eb',
    iconSize: 16,
    text: 'font-size:12.5px; color:#1e3a6a; line-height:1.5;',
  },
  amber: {
    wrap: 'display:flex; gap:13px; align-items:flex-start; background:#fff7ed; border:1px solid #fcd9a8; border-radius:14px; padding:16px 18px;',
    stroke: '#b45309',
    iconSize: 19,
    text: 'font-size:13.5px; color:#7c5010; line-height:1.55;',
  },
  amberCompact: {
    wrap: 'display:flex; gap:12px; align-items:flex-start; background:#fff7ed; border:1px solid #fcd9a8; border-radius:14px; padding:16px 18px;',
    stroke: '#b45309',
    iconSize: 19,
    text: 'font-size:13px; color:#7c5010; line-height:1.55;',
  },
  blue: {
    wrap: 'display:flex; gap:13px; align-items:flex-start; background:#eff4ff; border:1px solid #dbe4ff; border-radius:14px; padding:16px 18px;',
    stroke: '#2563eb',
    iconSize: 19,
    text: 'font-size:13px; color:#1e3a6a; line-height:1.55;',
  },
};

interface InfoNoteProps {
  variant: InfoNoteVariant;
  /** Extra declarations appended to the wrapper, e.g. `margin-bottom:22px;`. */
  style?: string;
  children: ReactNode;
}

export function InfoNote({ variant, style = '', children }: InfoNoteProps) {
  const v = VARIANTS[variant];

  return (
    <div style={css(v.wrap + style)}>
      <svg
        width={v.iconSize}
        height={v.iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={v.stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={css('flex-shrink:0; margin-top:1px;')}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="13" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div style={css(v.text)}>{children}</div>
    </div>
  );
}
