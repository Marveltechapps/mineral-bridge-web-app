/**
 * Design tokens lifted from the source design.
 *
 * The design expresses styling as inline strings computed in its logic layer.
 * Every literal below appears verbatim in
 * `design-source/Mineral Bridge Web v2.dc.html` — do not re-pick these values.
 */

export const COLOR = {
  /** Header / darkest navy. */
  navy: '#141a2e',
  /** Primary action navy. */
  navyAction: '#1e2a5a',
  /** Header control surface. */
  navySurface: '#1b2237',
  /** Header control border. */
  navyBorder: '#2b3352',
  /** Page background. */
  page: '#f5f6fa',
  surface: '#fff',
  /** Default hairline border. */
  border: '#e7eaf3',
  borderInput: '#dde2f0',
  borderStrong: '#cdd4e6',
  borderHover: '#cdd6ee',
  borderSubtle: '#f2f4fa',

  gold: '#c8962f',
  goldLight: '#f7dd8e',
  goldPale: '#fff4cf',

  textMuted: '#6b7290',
  textFaint: '#8b95b4',
  textDisabled: '#a3abc4',
  textSlate: '#5b638a',
  textSteel: '#4a5170',

  green: '#16a34a',
  greenBg: '#dcf3e8',
  greenText: '#15803d',
  blue: '#2563eb',
  blueBg: '#dbeafe',
  blueText: '#1d4ed8',
  amber: '#b45309',
  amberBg: '#fdecd6',
  amberText: '#9a4a06',
  red: '#dc2626',
  redBg: '#fdecec',
  redText: '#b91c1c',

  neutralBg: '#eef1f8',
  neutralBlueBg: '#eef1fb',
  rowHover: '#f8f9fc',
} as const;

export const FONT = {
  body: "'Plus Jakarta Sans',system-ui,sans-serif",
  display: "'Poppins'",
} as const;

/** Status chip colour pairs: [background, foreground]. */
export const CHIP = {
  GREEN: ['#dcf3e8', '#15803d'] as const,
  AMBER: ['#fdecd6', '#9a4a06'] as const,
  BLUE: ['#dbeafe', '#1d4ed8'] as const,
  GREY: ['#eef1f8', '#5b638a'] as const,
};

/** Shared field styles, exactly as the design computes them. */
export const FIELD = {
  lbl: 'display:block; font-size:12px; font-weight:800; letter-spacing:.5px; color:#5b638a; margin:16px 0 8px;',
  inp: 'width:100%; height:52px; border:1px solid #dde2f0; border-radius:13px; padding:0 15px; font-size:15px; color:#141a2e; background:#fff; outline:none;',
  ta: 'width:100%; min-height:104px; border:1px solid #dde2f0; border-radius:13px; padding:14px 15px; font-size:15px; color:#141a2e; background:#fff; outline:none; resize:vertical;',
  sel: 'width:100%; height:52px; border:1px solid #dde2f0; border-radius:13px; padding:0 40px 0 15px; font-size:15px; font-weight:600; color:#141a2e; background:#fff; outline:none; cursor:pointer; -webkit-appearance:none; appearance:none;',
} as const;

/** Raw SVG path data for the four icons the design ships. */
export const ICONS = {
  shield:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
  flask: '<path d="M9 2h6M10 2v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-10V2"/>',
  truck:
    '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  chain:
    '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
} as const;
