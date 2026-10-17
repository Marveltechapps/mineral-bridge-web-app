import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccountState, useKycState, useSessionState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { http } from '@/lib/api/client';
import { pickFile, uploadFile } from '@/lib/api/uploads';
import type { IconName, KycStage, KycStatus, RouteKey } from '@/types';

const CAPTURE_SIDE: Record<string, 'front' | 'back' | 'photo_page'> = {
  Front: 'front',
  Back: 'back',
  'Photo page': 'photo_page',
};
const SIDE_LABEL: Record<string, string> = { front: 'Front', back: 'Back', photo_page: 'Photo page' };

interface WebKyc {
  status: KycStatus | 'none';
  stage: KycStage;
  idType: string | null;
  reference: string | null;
  captures: Array<{ side: string }>;
  selfie: { fileId: string } | null;
}

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
  const { kycStage, kycIdType, kycShots, kycSelfie, kycStatus, kycReturn, setState, go } = useKycState();
  const { accForm } = useAccountState();
  const { authed } = useSessionState();
  const api = isApiConfigured();
  const kycQuery = useQuery({
    queryKey: ['kyc'],
    queryFn: ({ signal }) => http.get<WebKyc>('/kyc', { signal }),
    enabled: api && authed,
  });
  const hydrated = useRef(false);
  useEffect(() => {
    const record = kycQuery.data;
    if (!record || hydrated.current) return;
    hydrated.current = true;
    const shots: Record<string, boolean> = {};
    for (const capture of record.captures) {
      const label = SIDE_LABEL[capture.side];
      if (label) shots[label] = true;
    }
    const status: KycStatus =
      record.status === 'pending' || record.status === 'verified' ? record.status : 'unverified';
    setState({
      kycStatus: status,
      kycIdType: record.idType || 'national',
      kycShots: shots,
      kycSelfie: Boolean(record.selfie),
      kycStage: record.stage || 'why',
    });
  }, [kycQuery.data, setState]);

  return useMemo(() => {
    const ks = kycStage;
    const kIdx = KSTAGES.indexOf(ks);
    const activeId = ID_TYPES.find((t) => t.k === kycIdType) || ID_TYPES[0];
    const needBack = kycIdType !== 'passport';

    const kycSides = (needBack ? ['Front', 'Back'] : ['Photo page']).map((lbl) => {
      const done = !!kycShots[lbl];
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
        capture: () => {
          if (!api) {
            setState((s) => ({ kycShots: { ...s.kycShots, [lbl]: true } }));
            return;
          }
          void pickFile('image/jpeg,image/png,image/webp,application/pdf').then(async (file) => {
            if (!file) return;
            try {
              const fileId = await uploadFile(file, 'document');
              await http.post('/kyc/captures', { side: CAPTURE_SIDE[lbl], fileId });
              setState((s) => ({ kycShots: { ...s.kycShots, [lbl]: true } }));
            } catch (error: unknown) {
              setState({
                modal: {
                  title: 'Document was not uploaded',
                  body: error instanceof Error ? error.message : 'The capture was rejected.',
                  confirmLabel: 'Close',
                  confirm: () => setState({ modal: null }),
                },
              });
            }
          });
        },
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
        kycSelfie ? 'Continue' : 'Take selfie first',
        kycSelfie ? '#1e2a5a' : '#eef1f8',
        kycSelfie ? '#fff' : '#5b638a',
        !kycSelfie,
      ],
      review: ['Submit for verification', '#16a34a', '#fff'],
      pending: [
        kycStatus === 'verified'
          ? 'Start trading'
          : kycReturn
            ? 'Continue where you left off'
            : 'Back to account',
        '#1e2a5a',
        '#fff',
      ],
    };
    const kycCta = ctaMap[ks] || ['Continue', '#1e2a5a', '#fff'];
    const approved = kycStatus === 'verified';

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
      selfieDone: kycSelfie,
      selfiePending: !kycSelfie,
      selfieCta: kycSelfie ? 'Retake selfie' : 'Take selfie',
      livenessHint: kycSelfie
        ? 'Face captured — looks good'
        : 'Centre your face in the frame',
      showDemoApprove: !api,
      reference: api ? kycQuery.data?.reference || '—' : 'MB-KYC-77410',
      showSkip: ks !== 'pending',
      skipLabel: kycReturn ? 'Skip for now' : 'Do this later',
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
        const on = kycIdType === t.k;
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
          select: () => {
            setState({ kycIdType: t.k });
            if (api) {
              void http.patch('/kyc', { idType: t.k }).catch((error: unknown) => {
                setState({
                  modal: {
                    title: 'Document type was not saved',
                    body: error instanceof Error ? error.message : 'Try again.',
                    confirmLabel: 'Close',
                    confirm: () => setState({ modal: null }),
                  },
                });
              });
            }
          },
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
          v: kycShots['Front'] || kycShots['Photo page'] ? 'Captured' : 'Missing',
          ok: !!(kycShots['Front'] || kycShots['Photo page']),
        },
        {
          k: 'Back image',
          v: needBack ? (kycShots['Back'] ? 'Captured' : 'Missing') : 'Not required',
          ok: needBack ? !!kycShots['Back'] : true,
        },
        { k: 'Liveness selfie', v: kycSelfie ? 'Captured' : 'Missing', ok: kycSelfie },
        { k: 'Full name', v: accForm.name || '—', ok: Boolean(accForm.name) },
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
      kycSelfie: () => {
        if (!api) {
          setState((s) => ({ kycSelfie: !s.kycSelfie }));
          return;
        }
        void pickFile('image/jpeg,image/png,image/webp').then(async (file) => {
          if (!file) return;
          try {
            const fileId = await uploadFile(file, 'document');
            await http.post('/kyc/selfie', { fileId });
            setState({ kycSelfie: true });
          } catch (error: unknown) {
            setState({
              modal: {
                title: 'Selfie was not uploaded',
                body: error instanceof Error ? error.message : 'The liveness check was rejected.',
                confirmLabel: 'Close',
                confirm: () => setState({ modal: null }),
              },
            });
          }
        });
      },
      kycApprove: () => setState({ kycStatus: 'verified' }),
      kycSkip: () => {
        const back: RouteKey =
          kycReturn && kycReturn !== true ? (kycReturn as RouteKey) : 'home';
        setState({ kycReturn: false });
        go(back);
      },
      kycBack: () => {
        const i = KSTAGES.indexOf(kycStage);
        if (i <= 0) {
          go('account');
          return;
        }
        setState({ kycStage: KSTAGES[i - 1] });
      },
      kycNextStage: () => {
        const i = KSTAGES.indexOf(kycStage);
        if (kycStage === 'capture') {
          const need = kycIdType !== 'passport' ? ['Front', 'Back'] : ['Photo page'];
          if (!need.every((k) => kycShots[k])) return;
        }
        if (kycStage === 'live' && !kycSelfie) return;
        if (kycStage === 'pending') {
          if (kycReturn) {
            setState({ kycReturn: false });
            go(kycReturn === true ? 'orders' : (kycReturn as RouteKey));
            return;
          }
          go('account');
          return;
        }
        if (kycStage === 'review') {
          if (!api) {
            setState({ kycStage: 'pending', kycStatus: 'pending' });
            requestAnimationFrame(() => window.scrollTo({ top: 0 }));
            return;
          }
          void http
            .post<{ reference?: string }>('/kyc/submit')
            .then((result) => {
              setState({
                kycStage: 'pending',
                kycStatus: 'pending',
                modal: result?.reference
                  ? {
                      title: 'Verification submitted',
                      body: `Reference ${result.reference}. Compliance will update this status.`,
                      confirmLabel: 'Done',
                      confirm: () => setState({ modal: null }),
                    }
                  : null,
              });
            })
            .catch((error: unknown) => {
              setState({
                modal: {
                  title: 'Verification was not submitted',
                  body: error instanceof Error ? error.message : 'The KYC submission was rejected.',
                  confirmLabel: 'Close',
                  confirm: () => setState({ modal: null }),
                },
              });
            });
          return;
        }
        setState({ kycStage: KSTAGES[i + 1] });
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      },
    };
  }, [
    kycStage,
    kycIdType,
    kycShots,
    kycSelfie,
    kycStatus,
    kycReturn,
    setState,
    go,
    api,
    accForm.name,
    kycQuery.data,
  ]);
}
