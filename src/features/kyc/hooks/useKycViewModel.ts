import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAccountState, useKycState, useSessionState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { http } from '@/lib/api/client';
import { uploadFile } from '@/lib/api/uploads';
import type { KycShot } from '@/store/slices/kycSlice';
import type { IconName, KycStage, KycStatus, RouteKey } from '@/types';

const MAX_ID_PHOTO_BYTES = 10 * 1024 * 1024;

interface PendingShot {
  file: File;
  url: string;
}

interface CameraSession {
  label: string;
  stream: MediaStream;
  /** Document photos use the rear camera. A selfie must use the front camera. */
  mode: 'document' | 'selfie';
}

interface SelfieUploadResult {
  liveness?: { passed?: boolean; reason?: string | null };
}

function isIdPhoto(file: File): boolean {
  const type = file.type.toLowerCase();
  return (
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    type === 'image/png' ||
    type === 'image/webp' ||
    /\.(jpe?g|png|webp)$/i.test(file.name)
  );
}

/** Some gallery picks omit a MIME type. The upload API rejects an empty content type. */
function withPhotoType(file: File): File {
  if (file.type) return file;
  const name = file.name.toLowerCase();
  const type = name.endsWith('.png')
    ? 'image/png'
    : name.endsWith('.webp')
      ? 'image/webp'
      : name.endsWith('.jpg') || name.endsWith('.jpeg')
        ? 'image/jpeg'
        : '';
  return type ? new File([file], file.name, { type }) : file;
}

function previewFor(file: File): Promise<string> {
  if (typeof URL.createObjectURL === 'function') {
    try {
      const url = URL.createObjectURL(file);
      if (url) return Promise.resolve(url);
    } catch {
      // jsdom does not implement object URLs; fall through to a data URL.
    }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the photo.'));
    reader.readAsDataURL(file);
  });
}

function releasePreview(shot: KycShot | undefined) {
  if (shot && typeof shot === 'object' && shot.url.startsWith('blob:')) URL.revokeObjectURL(shot.url);
}

function shotPreview(shot: KycShot | undefined): string {
  return shot && typeof shot === 'object' ? shot.url : '';
}

/** A boolean shot was already stored on the server. A preview is ready once its upload finishes. */
function shotReady(shot: KycShot | undefined): boolean {
  if (shot === true) return true;
  return !!shot && typeof shot === 'object' && shot.ready && shot.url.length > 0;
}

/** Ask for a camera. A failed facing-mode request retries with any camera. Never opens the gallery. */
async function requestCamera(facing: 'user' | 'environment'): Promise<MediaStream> {
  const media = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
  if (!media?.getUserMedia) throw new Error('This browser cannot open the camera.');
  try {
    return await media.getUserMedia({ audio: false, video: { facingMode: { ideal: facing } } });
  } catch {
    return media.getUserMedia({ audio: false, video: true });
  }
}

function webIdType(value: string): 'national' | 'passport' | 'licence' {
  if (value === 'passport' || value === 'licence') return value;
  return 'national';
}

const CAPTURE_SIDE: Record<string, 'front' | 'back' | 'photo_page'> = {
  Front: 'front',
  Back: 'back',
  'Photo page': 'photo_page',
};
const SIDE_LABEL: Record<string, string> = { front: 'Front', back: 'Back', photo_page: 'Photo page' };

export interface WebKycDocument {
  kind: string;
  side: string | null;
  name: string;
  fileId?: string;
  status: string;
  rejectionReason?: string | null;
}

interface WebKyc {
  status: KycStatus | 'none' | 'rejected';
  stage: KycStage;
  idType: string | null;
  reference: string | null;
  captures: Array<{ side: string; fileId?: string }>;
  selfie: { fileId: string } | null;
  rejectionReason?: string | null;
  retryAllowed?: boolean | null;
  resubmissionRequired?: boolean;
  documents?: WebKycDocument[];
}

function documentStatusLabel(status: string): string {
  if (status === 'verified') return 'Verified';
  if (status === 'rejected') return 'Rejected';
  if (status === 'in_review') return 'In review';
  return 'Uploaded';
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
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 10000 : false),
  });
  const appliedDecision = useRef('');
  const [feedbackUrls, setFeedbackUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    const record = kycQuery.data;
    if (!record) return;
    const signature = `${record.status}|${record.reference ?? ''}|${record.rejectionReason ?? ''}|${record.resubmissionRequired ? '1' : '0'}`;
    const decisionChanged = appliedDecision.current !== signature;
    if (!decisionChanged) return;
    appliedDecision.current = signature;
    const shots: Record<string, boolean> = {};
    for (const capture of record.captures) {
      const label = SIDE_LABEL[capture.side];
      if (label) shots[label] = true;
    }
    const status: KycStatus =
      record.status === 'pending' || record.status === 'verified' ? record.status : 'unverified';
    const serverProgress =
      status !== 'unverified' ||
      Boolean(record.idType) ||
      record.captures.length > 0 ||
      Boolean(record.selfie) ||
      Boolean(record.rejectionReason);
    // `why` exists only in the client. A new account has no documents yet, so the
    // server stage is `type`; keep the screen the user is already on until they move.
    setState((current) => ({
      kycStatus: status,
      kycIdType: record.idType || current.kycIdType,
      kycShots: Object.keys(shots).length > 0 ? { ...current.kycShots, ...shots } : current.kycShots,
      kycSelfie: Boolean(record.selfie) || current.kycSelfie,
      kycStage: serverProgress ? (record.status === 'rejected' ? 'capture' : record.stage || current.kycStage) : current.kycStage,
    }));
    for (const capture of record.captures) {
      const label = SIDE_LABEL[capture.side];
      if (!label || !capture.fileId) continue;
      void http
        .get<{ url: string }>(`/files/${capture.fileId}`)
        .then((signed) => {
          if (!signed?.url) return;
          setState((current) => {
            const existing = current.kycShots[label];
            if (existing && typeof existing !== 'boolean') return {};
            return { kycShots: { ...current.kycShots, [label]: { url: signed.url, ready: true } } };
          });
        })
        .catch(() => undefined);
    }
    for (const doc of record.documents ?? []) {
      if (!doc.fileId) continue;
      const fileId = doc.fileId;
      void http
        .get<{ url: string }>(`/files/${fileId}`)
        .then((signed) => {
          if (!signed?.url) return;
          setFeedbackUrls((current) => ({ ...current, [fileId]: signed.url }));
        })
        .catch(() => undefined);
    }
  }, [kycQuery.data, setState]);

  const [camera, setCamera] = useState<CameraSession | null>(null);
  const [selfiePreview, setSelfiePreview] = useState('');
  const [selfieUploading, setSelfieUploading] = useState(false);
  const selfiePreviewRef = useRef('');
  const pendingFiles = useRef(new Map<string, PendingShot>());

  const fail = useCallback(
    (title: string, body: string) => {
      setState({
        modal: {
          title,
          body,
          confirmLabel: 'Close',
          confirm: () => setState({ modal: null }),
        },
      });
    },
    [setState],
  );

  const uploadCommitted = useCallback(
    async (label: string, file: File, previewUrl: string) => {
      setState((current) => {
        const shot = current.kycShots[label];
        if (!shot || typeof shot === 'boolean' || shot.url !== previewUrl || shot.uploading) return {};
        return {
          kycShots: { ...current.kycShots, [label]: { url: previewUrl, ready: false, uploading: true } },
        };
      });
      try {
        await http.patch('/kyc', { idType: webIdType(kycIdType) });
        const fileId = await uploadFile(file, 'document');
        await http.post('/kyc/captures', { side: CAPTURE_SIDE[label], fileId });
        setState((current) => {
          const shot = current.kycShots[label];
          if (!shot || typeof shot === 'boolean' || shot.url !== previewUrl) return {};
          return {
            kycShots: { ...current.kycShots, [label]: { url: previewUrl, ready: true, uploading: false } },
          };
        });
      } catch (error: unknown) {
        setState((current) => {
          const shot = current.kycShots[label];
          const next = { ...current.kycShots };
          if (shot && typeof shot !== 'boolean' && shot.url === previewUrl) {
            next[label] = { url: previewUrl, ready: false, uploading: false };
          }
          return {
            kycShots: next,
            modal: {
              title: 'Document was not uploaded',
              body: error instanceof Error ? error.message : 'The capture was rejected.',
              confirmLabel: 'Close',
              confirm: () => setState({ modal: null }),
            },
          };
        });
      }
    },
    [kycIdType, setState],
  );

  useEffect(() => {
    if (!api || !authed) return;
    const queued = [...pendingFiles.current.entries()];
    pendingFiles.current.clear();
    for (const [label, item] of queued) void uploadCommitted(label, item.file, item.url);
  }, [api, authed, uploadCommitted]);

  const acceptDocument = useCallback(
    async (label: string, raw: File) => {
      const file = withPhotoType(raw);
      if (!isIdPhoto(file)) {
        fail('Use a photo', 'Choose a JPG, PNG or WebP image from your camera or gallery.');
        return;
      }
      if (file.size <= 0 || file.size > MAX_ID_PHOTO_BYTES) {
        fail('Photo is too large', 'Each side must be a photo of 10 MB or smaller.');
        return;
      }
      let url = '';
      try {
        url = await previewFor(file);
      } catch (error: unknown) {
        fail('Photo could not be read', error instanceof Error ? error.message : 'Choose the photo again.');
        return;
      }
      if (!url) {
        fail('Photo could not be read', 'Choose the photo again.');
        return;
      }
      setState((current) => {
        releasePreview(current.kycShots[label]);
        return {
          kycShots: {
            ...current.kycShots,
            [label]: { url, ready: !api, uploading: Boolean(api && authed) },
          },
        };
      });
      if (!api) return;
      if (!authed) {
        pendingFiles.current.set(label, { file, url });
        setState({ authOpen: true, authMode: 'login', authStage: 'form' });
        return;
      }
      await uploadCommitted(label, file, url);
    },
    [api, authed, fail, setState, uploadCommitted],
  );

  const closeCamera = useCallback(() => {
    setCamera((current) => {
      current?.stream.getTracks().forEach((track) => track.stop());
      return null;
    });
  }, []);

  const showCamera = useCallback((label: string, stream: MediaStream, mode: CameraSession['mode']) => {
    setCamera((current) => {
      current?.stream.getTracks().forEach((track) => track.stop());
      return { label, stream, mode };
    });
  }, []);

  const openCamera = useCallback(
    (label: string) => {
      void requestCamera('environment')
        .then((stream) => showCamera(label, stream, 'document'))
        .catch(() => {
          fail(
            'Camera unavailable',
            'This browser cannot open the camera. Choose a photo from your gallery instead.',
          );
        });
    },
    [fail, showCamera],
  );

  const rememberSelfie = useCallback((url: string) => {
    if (selfiePreviewRef.current.startsWith('blob:')) URL.revokeObjectURL(selfiePreviewRef.current);
    selfiePreviewRef.current = url;
    setSelfiePreview(url);
  }, []);

  const acceptSelfie = useCallback(
    async (raw: File) => {
      const file = withPhotoType(raw);
      if (!isIdPhoto(file)) {
        fail('Use a photo', 'The selfie must be a JPG, PNG or WebP image from the camera.');
        return;
      }
      let url = '';
      try {
        url = await previewFor(file);
      } catch (error: unknown) {
        fail('Selfie could not be read', error instanceof Error ? error.message : 'Take the selfie again.');
        return;
      }
      if (!url) {
        fail('Selfie could not be read', 'Take the selfie again.');
        return;
      }
      rememberSelfie(url);
      if (!api) {
        setState({ kycSelfie: true });
        return;
      }
      if (!authed) {
        setState({ authOpen: true, authMode: 'login', authStage: 'form', kycSelfie: false });
        return;
      }
      setSelfieUploading(true);
      try {
        const fileId = await uploadFile(file, 'document');
        const result = await http.post<SelfieUploadResult>('/kyc/selfie', { fileId });
        if (result?.liveness?.passed === false) {
          setState({
            kycSelfie: false,
            modal: {
              title: 'Liveness check failed',
              body: result.liveness.reason || 'Centre your face in the frame and take the selfie again.',
              confirmLabel: 'Retake',
              confirm: () => setState({ modal: null }),
            },
          });
          return;
        }
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
      } finally {
        setSelfieUploading(false);
      }
    },
    [api, authed, fail, rememberSelfie, setState],
  );

  const startSelfie = useCallback(() => {
    void requestCamera('user')
      .then((stream) => showCamera('selfie', stream, 'selfie'))
      .catch(() => {
        fail(
          'Camera required',
          'Liveness needs a live camera photo. Allow camera access and try again. A picture from the gallery cannot be used.',
        );
      });
  }, [fail, showCamera]);

  useEffect(() => () => camera?.stream.getTracks().forEach((track) => track.stop()), [camera]);

  const model = useMemo(() => {
    const ks = kycStage;
    const kIdx = KSTAGES.indexOf(ks);
    const activeId = ID_TYPES.find((t) => t.k === kycIdType) || ID_TYPES[0];
    const needBack = kycIdType !== 'passport';

    const serverDocs = kycQuery.data?.documents ?? [];
    const kycSides = (needBack ? ['Front', 'Back'] : ['Photo page']).map((lbl) => {
      const shot = kycShots[lbl];
      const previewUrl = shotPreview(shot);
      const done = shotReady(shot);
      const uploading = !!shot && typeof shot === 'object' && shot.uploading === true;
      const serverDoc = serverDocs.find((doc) => SIDE_LABEL[doc.side ?? ''] === lbl);
      return {
        label: lbl,
        done,
        pending: !done,
        uploading,
        previewUrl,
        feedback: serverDoc
          ? {
              statusLabel: documentStatusLabel(serverDoc.status),
              reason: serverDoc.rejectionReason || '',
              rejected: serverDoc.status === 'rejected',
            }
          : null,
        grad: 'linear-gradient(150deg,#5b6480,#2a3350)',
        boxStyle:
          'position:relative; height:190px; border-radius:16px; display:flex; align-items:center; justify-content:center; overflow:hidden; background:' +
          (previewUrl || done ? 'transparent' : '#f9fafd') +
          '; border:' +
          (done ? '1.5px solid #16a34a' : '1.5px dashed #cdd4e6') +
          ';',
      };
    });

    const shotsDone = kycSides.every((s) => s.done);

    const ctaMap: Record<string, [string, string, string, boolean?]> = {
      why: ['Start verification', '#1e2a5a', '#fff'],
      type: ['Continue', '#1e2a5a', '#fff'],
      capture: [
        shotsDone ? 'Continue' : needBack ? 'Capture both sides' : 'Capture photo page',
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
      captureHint: needBack
        ? 'Both sides, in focus, all four corners visible.'
        : 'Photo page, in focus, all four corners visible.',
      selfieDone: kycSelfie,
      selfieInitials:
        accForm.name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? '')
          .join('') || '•',
      selfiePending: !kycSelfie,
      selfieCta: kycSelfie ? 'Retake selfie' : 'Take selfie',
      livenessHint: kycSelfie
        ? 'Face captured — looks good'
        : 'Centre your face in the frame',
      showDemoApprove: !api,
      reference: api ? kycQuery.data?.reference || '—' : 'MB-KYC-77410',
      showSkip: false,
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
      feedback: kycQuery.data?.rejectionReason
        ? {
            title: kycQuery.data.resubmissionRequired ? 'Please upload this again' : 'Verification was not accepted',
            reason: kycQuery.data.rejectionReason,
            documents: (kycQuery.data.documents ?? []).map((doc) => ({
              key: doc.fileId || doc.kind,
              name: doc.name,
              statusLabel: documentStatusLabel(doc.status),
              reason: doc.rejectionReason || '',
              previewUrl: doc.fileId ? feedbackUrls[doc.fileId] || '' : '',
              rejected: doc.status === 'rejected',
            })),
          }
        : null,
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
          v: shotReady(kycShots['Front']) || shotReady(kycShots['Photo page']) ? 'Captured' : 'Missing',
          ok: shotReady(kycShots['Front']) || shotReady(kycShots['Photo page']),
        },
        {
          k: 'Back image',
          v: needBack ? (shotReady(kycShots['Back']) ? 'Captured' : 'Missing') : 'Not required',
          ok: needBack ? shotReady(kycShots['Back']) : true,
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
          if (!need.every((k) => shotReady(kycShots[k]))) return;
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
    feedbackUrls,
  ]);

  return {
    ...model,
    camera,
    openCamera,
    closeCamera,
    acceptDocument,
    acceptSelfie,
    startSelfie,
    selfiePreview,
    selfieUploading,
  };
}
