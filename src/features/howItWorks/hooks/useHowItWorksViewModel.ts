import { useMemo } from 'react';
import { useHowItWorksState } from '@/hooks/useAppState';
import type { Chapter, IconName } from '@/types';

export const CHAPTERS: Chapter[] = [
  {
    t: 'The problem',
    cap: 'Small-scale miners sell blind — no rates, no proof, no protection.',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Gold%20mine.jpg?width=1200") center/cover, linear-gradient(150deg,#3a2c14,#0e1430)',
  },
  {
    t: 'We buy from you',
    cap: 'Tell us what you have. Our verification team comes to you and checks it in person.',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Native%20gold%20nuggets.jpg?width=1200") center/cover, linear-gradient(150deg,#f3d27a,#8a6410)',
  },
  {
    t: 'We assure it',
    cap: 'Once verified, your mineral is packed, sealed and shipped to Mineral Bridge.',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Chemistry%20laboratory.jpg?width=1200") center/cover, linear-gradient(150deg,#1a4d33,#0d2a1c)',
  },
  {
    t: 'You get paid',
    cap: 'Our support team contacts you directly to confirm and arrange your payment.',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Gold-crystals.jpg?width=1200") center/cover, linear-gradient(150deg,#1e2a5a,#0e1430)',
  },
  {
    t: 'Buyers buy assured',
    cap: 'Institutions buy from owned, documented inventory — ready to ship.',
    grad: 'url("https://commons.wikimedia.org/wiki/Special:FilePath/Open%20pit%20mine.jpg?width=1200") center/cover, linear-gradient(150deg,#2a4d6b,#12283a)',
  },
];

/** Chapter start times, in seconds, across the 47-second explainer. */
const CHAPTER_SECONDS = [0, 9, 19, 29, 38];
const TOTAL_SECONDS = 47;

interface TopicDef {
  k: string;
  title: string;
  sub: string;
  bg: string;
  color: string;
  ic: IconName;
  points: string[];
}

const TOPIC_DEFS: TopicDef[] = [
  {
    k: 'sell',
    title: 'Selling to Mineral Bridge',
    sub: 'Submit details, on-site verification, support-arranged payment',
    bg: '#fdecd6',
    color: '#b45309',
    ic: 'truck',
    points: [
      'Enter your mineral, quantity and form — or pick "Other" if it is not in our catalogue.',
      'Our verification team travels to your location and checks the mineral on the spot.',
      'Once verified, the mineral is packed and sealed, then shipped to Mineral Bridge.',
      'Our support team contacts you directly to confirm the amount and arrange payment.',
    ],
  },
  {
    k: 'assure',
    title: 'How we assure every lot',
    sub: 'Fire assay, XRF, sealed custody',
    bg: '#dcf3e8',
    color: '#16a34a',
    ic: 'flask',
    points: [
      'Fire assay establishes true metal content — the industry reference method.',
      'XRF confirms purity without destroying the sample.',
      'Weight is verified to ±0.1 and recorded against the sealed lot.',
      'Every result is attached to the lot as a downloadable certificate.',
    ],
  },
  {
    k: 'buy',
    title: 'Buying assured minerals',
    sub: 'Owned inventory, documented, ready to ship',
    bg: '#dbeafe',
    color: '#2563eb',
    ic: 'shield',
    points: [
      'You buy from inventory we already own — not from an unknown third party.',
      'Each lot carries its assay certificate, origin and export permit.',
      'Our desk confirms final pricing before any payment is taken.',
      'Bonded, insured logistics deliver to your facility or vault.',
    ],
  },
  {
    k: 'chain',
    title: 'Escrow and on-chain provenance',
    sub: 'Money moves only on verified custody',
    bg: '#eef1fb',
    color: '#1e2a5a',
    ic: 'chain',
    points: [
      'Funds sit in a smart-contract escrow, not with either party.',
      'Custody transfers are written to an immutable ledger with timestamps.',
      'Identity, banking and negotiation data stay encrypted and off-chain.',
      'Escrow releases automatically once custody is verified by both sides.',
    ],
  },
];

const chipCh = (on: boolean) =>
  'padding:7px 12px; border-radius:8px; border:1px solid ' +
  (on ? 'rgba(247,221,142,.6)' : 'rgba(255,255,255,.16)') +
  '; background:' +
  (on ? 'rgba(247,221,142,.18)' : 'rgba(255,255,255,.07)') +
  '; color:' +
  (on ? '#f7dd8e' : 'rgba(255,255,255,.7)') +
  '; font-size:11.5px; font-weight:800; cursor:pointer;';

/** View model shared by the "How it works" overlay and its full page. */
export function useHowItWorksViewModel() {
  const { hiwChapter, hiwPlaying, hiwTopic, hiwOverlay, setState } = useHowItWorksState();

  return useMemo(() => {
    const ci = Math.min(CHAPTERS.length - 1, hiwChapter);
    const secs = CHAPTER_SECONDS[ci] + (hiwPlaying ? 4 : 0);
    const mmss = (s: number) => '0:' + String(Math.min(TOTAL_SECONDS, s)).padStart(2, '0');

    const hiw = {
      chapterNo: String(ci + 1),
      chapterTitle: CHAPTERS[ci].t,
      caption: CHAPTERS[ci].cap,
      frameStyle: 'position:absolute; inset:0; background:' + CHAPTERS[ci].grad + ';',
      playing: hiwPlaying,
      paused: !hiwPlaying,
      showBigPlay: !hiwPlaying,
      pos: Math.round((secs / TOTAL_SECONDS) * 100) + '%',
      clock: mmss(secs) + ' / 0:47',
      chapters: CHAPTERS.map((_, i) => ({
        label: String(i + 1),
        style: chipCh(i === ci),
        select: () => setState({ hiwChapter: i }),
      })),
      play: () => setState((s) => ({ hiwPlaying: !s.hiwPlaying })),
      seek: () => setState((s) => ({ hiwChapter: (s.hiwChapter + 1) % 5 })),
    };

    const hiwTopics = TOPIC_DEFS.map((t) => {
      const open = hiwTopic === t.k;
      return {
        k: t.k,
        title: t.title,
        sub: t.sub,
        bg: t.bg,
        color: t.color,
        ic: t.ic,
        open,
        points: t.points.map((v, i) => ({ n: String(i + 1), v })),
        caret:
          'display:flex; transition:transform .22s ease; transform:rotate(' +
          (open ? '180deg' : '0') +
          ');',
        cardStyle:
          'background:#fff; border:1px solid ' +
          (open ? '#cdd6ee' : '#e7eaf3') +
          '; border-radius:18px; overflow:hidden; box-shadow:0 4px 14px rgba(20,26,46,' +
          (open ? '.09' : '.05') +
          ');',
        toggle: () => setState((s) => ({ hiwTopic: s.hiwTopic === t.k ? null : t.k })),
      };
    });

    return { hiw, hiwTopics, overlayOpen: hiwOverlay };
  }, [hiwChapter, hiwPlaying, hiwTopic, hiwOverlay, setState]);
}
