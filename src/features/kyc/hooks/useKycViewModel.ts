import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import type { IconName, KycStage, RouteKey } from '@/types';

const KSTAGES: KycStage[] = ['why', 'type', 'capture', 'live', 'review', 'pending'];

interface IdType {
  k: string;
  label: string;
  sub: string;
  bg: string;
  color: string;
  ic: IconName;
}

const ID_TYPES: IdType[] = [
  {
    k: 'national',
    label: 'National ID card',
    sub: 'Front and back required',
    bg: '#eef1fb',
    color: '#1e2a5a',
    ic: 'shield',
  },
  {
    k: 'passport',
    label: 'Passport',
    sub: 'Photo page only',
    bg: '#dbeafe',
    color: '#2563eb',
    ic: 'chain',
  },
  {
    k: 'licence',
    label: 'Driver’s licence',
    sub: 'Front and back required',
    bg: '#fdecd6',
    color: '#b45309',
    ic: 'truck',
  },
];

const WHY: { title: string; sub: string; bg: string; color: string; ic: IconName }[] = [
  {
    title: 'Protects honest sellers',
    sub: 'Stops stolen or misdeclared material entering the market.',
    bg: '#dcf3e8',
    color: '#16a34a',
    ic: 'shield',
  },
  {
    title: 'Lets us pay you legally',
    sub: 'Banks and escrow require a verified identity before releasing funds.',
    bg: '#dbeafe',
    color: '#2563eb',
    ic: 'chain',
  },
  {
    title: 'Unlocks higher limits',
    sub: 'Verified accounts trade larger lots and get priority evaluation.',
    bg: '#fdecd6',
    color: '#b45309',
    ic: 'truck',
  },
  {
    title: 'Required by regulation',
    sub: 'Mineral trading is subject to AML and export compliance rules.',
    bg: '#eef1fb',
    color: '#1e2a5a',
    ic: 'flask',
  },
];

/** View model for the six-stage identity-verification flow. */
export function useKycViewModel() {
  const { state, setState, go } = useAppState();

  return useMemo(() => {
    const ks = state.kycStage;
    const kIdx = KSTAGES.indexOf(ks);
    const activeId = ID_TYPES.find((t) => t.k === state.kycIdType) || ID_TYPES[0];
    const needBack = state.kycIdType !== 'passport';

    const kycSides = (needBack ? ['Front', 'Back'] : ['Photo page']).map((lbl) => {
      const done = !!state.kycShots[lbl];
      return {
        label: lbl,
        done,
        pending: !done,
        grad: 'linear-gradient(150deg,#5b6480,#2a3350)',
        boxStyle:
          'position:relative; height:190px; border-radius:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; overflow:hidden; background:' +
          (done ? 'transparent' : '#f9fafd') +
          '; border:' +
          (done ? '1.5px solid #16a34a' : '1.5px dashed #cdd4e6') +
          ';',
        capture: () => setState((s) => ({ kycShots: { ...s.kycShots, [lbl]: true } })),
      };
    });

    const shotsDone = kycSides.every((s) => s.done);

    const ctaMap: Record<string, [string, string, string, boolean?]> = {
      why: ['Start verification', '#1e2a5a', '#fff'],
      type: ['Continue', '#1e2a5a', '#fff'],
      capture: [
        shotsDone ? 'Continue' : 'Capture both sides',
        shotsDone ? '#1e2a5a' : '#eef1f8',
        shotsDone ? '#fff' : '#5b638a',
        !shotsDone,
      ],
      live: [
        state.kycSelfie ? 'Continue' : 'Take selfie first',
        state.kycSelfie ? '#1e2a5a' : '#eef1f8',
        state.kycSelfie ? '#fff' : '#5b638a',
        !state.kycSelfie,
      ],
      review: ['Submit for verification', '#16a34a', '#fff'],
      pending: [
        state.kycStatus === 'verified'
          ? 'Start trading'
          : state.kycReturn
            ? 'Continue where you left off'
            : 'Back to account',
        '#1e2a5a',
        '#fff',
      ],
    };
    const kycCta = ctaMap[ks] || ['Continue', '#1e2a5a', '#fff'];
    const approved = state.kycStatus === 'verified';

    const kyc = {
      isWhy: ks === 'why',
      isType: ks === 'type',
      isCapture: ks === 'capture',
      isLive: ks === 'live',
      isReview: ks === 'review',
      isPending: ks === 'pending',
      progress: Math.round(((kIdx + 1) / KSTAGES.length) * 100) + '%',
      stepLabel: 'Step ' + (kIdx + 1) + ' of 6',
      idLabel: activeId.label.toLowerCase(),
      selfieDone: state.kycSelfie,
      selfiePending: !state.kycSelfie,
      selfieCta: state.kycSelfie ? 'Retake selfie' : 'Take selfie',
      livenessHint: state.kycSelfie
        ? 'Face captured — looks good'
        : 'Centre your face in the frame',
      showSkip: ks !== 'pending',
      skipLabel: state.kycReturn ? 'Skip for now' : 'Do this later',
      isApproved: approved,
      notApproved: !approved,
      ctaLabel: kycCta[0],
      ctaBlocked: !!kycCta[3],
      ctaStyle:
        'height:54px; padding:0 34px; border:none; border-radius:13px; font-size:15.5px; font-weight:800; background:' +
        kycCta[1] +
        '; color:' +
        kycCta[2] +
        '; cursor:' +
        (kycCta[3] ? 'not-allowed' : 'pointer') +
        ';',
      statusGlow:
        'position:absolute; inset:-14px; border-radius:70px; background:radial-gradient(circle,' +
        (approved ? 'rgba(22,163,74,.24)' : 'rgba(180,83,9,.24)') +
        ',transparent 70%);',
      statusIcon:
        'position:relative; width:110px; height:110px; border-radius:55px; display:flex; align-items:center; justify-content:center; background:' +
        (approved ? '#dcf3e8' : '#fdecd6') +
        '; color:' +
        (approved ? '#16a34a' : '#b45309') +
        ';',
      pendingTitle: approved ? 'Verification approved' : 'Verification under review',
      pendingBody: approved
        ? 'Your identity is verified. You now have full access to buying, selling and bidding.'
        : 'Our compliance desk is checking your documents. This usually takes under 24 hours — we’ll notify you the moment it clears.',
      refLabel: approved ? 'APPROVED' : 'PENDING',
      refChip:
        'font-size:11.5px; font-weight:800; padding:6px 13px; border-radius:9px; white-space:nowrap; ' +
        (approved ? 'color:#16a34a; background:#dcf3e8;' : 'color:#b45309; background:#fdecd6;'),
    };

    return {
      kyc,
      kycSides,
      kycWhy: WHY,
      kycIdTypes: ID_TYPES.map((t) => {
        const on = state.kycIdType === t.k;
        return {
          ...t,
          on,
          radio:
            'width:24px; height:24px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:2px solid ' +
            (on ? '#1e2a5a' : '#cdd4e6') +
            '; background:' +
            (on ? '#1e2a5a' : '#fff') +
            ';',
          style:
            'display:flex; align-items:center; gap:16px; width:100%; padding:18px 20px; border-radius:16px; cursor:pointer; text-align:left; border:1.5px solid ' +
            (on ? '#1e2a5a' : '#e7eaf3') +
            '; background:' +
            (on ? '#f7f9ff' : '#fff') +
            '; transition:all .18s ease;',
          select: () => setState({ kycIdType: t.k }),
        };
      }),
      kycTips: [
        { v: 'Place the document on a flat, dark surface' },
        { v: 'Avoid glare and shadows across the text' },
        { v: 'All four corners must be inside the frame' },
      ],
      kycReview: [
        { k: 'Document type', v: activeId.label, ok: true },
        {
          k: 'Front image',
          v: state.kycShots['Front'] || state.kycShots['Photo page'] ? 'Captured' : 'Missing',
          ok: !!(state.kycShots['Front'] || state.kycShots['Photo page']),
        },
        {
          k: 'Back image',
          v: needBack ? (state.kycShots['Back'] ? 'Captured' : 'Missing') : 'Not required',
          ok: needBack ? !!state.kycShots['Back'] : true,
        },
        { k: 'Liveness selfie', v: state.kycSelfie ? 'Captured' : 'Missing', ok: state.kycSelfie },
        { k: 'Full name', v: 'Marvel Tech', ok: true },
      ],
      kycNext: [
        { title: 'Documents received', sub: 'Encrypted and queued for review', done: true },
        {
          title: 'Compliance check',
          sub: approved ? 'Cleared by our compliance desk' : 'Usually clears within 24 hours',
          done: approved,
        },
        {
          title: 'Full trading access',
          sub: approved
            ? 'Unlocked — buy, sell and bid without limits'
            : 'Buy, sell and bid without limits',
          done: approved,
        },
      ].map((n) => ({
        ...n,
        color: n.done ? '#141a2e' : '#a3abc4',
        dot:
          'width:22px; height:22px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:' +
          (n.done ? '#16a34a' : '#eef1f8') +
          ';',
      })),
      kycSelfie: () => setState((s) => ({ kycSelfie: !s.kycSelfie })),
      kycApprove: () => setState({ kycStatus: 'verified' }),
      kycSkip: () => {
        const back: RouteKey =
          state.kycReturn && state.kycReturn !== true ? (state.kycReturn as RouteKey) : 'home';
        setState({ kycReturn: false });
        go(back);
      },
      kycBack: () => {
        const i = KSTAGES.indexOf(state.kycStage);
        if (i <= 0) {
          go('account');
          return;
        }
        setState({ kycStage: KSTAGES[i - 1] });
      },
      kycNextStage: () => {
        const i = KSTAGES.indexOf(state.kycStage);
        if (state.kycStage === 'capture') {
          const need = state.kycIdType !== 'passport' ? ['Front', 'Back'] : ['Photo page'];
          if (!need.every((k) => state.kycShots[k])) return;
        }
        if (state.kycStage === 'live' && !state.kycSelfie) return;
        if (state.kycStage === 'pending') {
          if (state.kycReturn) {
            setState({ kycReturn: false });
            go(state.kycReturn === true ? 'orders' : (state.kycReturn as RouteKey));
            return;
          }
          go('account');
          return;
        }
        if (state.kycStage === 'review') {
          setState({ kycStage: 'pending', kycStatus: 'pending' });
          requestAnimationFrame(() => window.scrollTo({ top: 0 }));
          return;
        }
        setState({ kycStage: KSTAGES[i + 1] });
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      },
    };
  }, [
    state.kycStage,
    state.kycIdType,
    state.kycShots,
    state.kycSelfie,
    state.kycStatus,
    state.kycReturn,
    setState,
    go,
  ]);
}
