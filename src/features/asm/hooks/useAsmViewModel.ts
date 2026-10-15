import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { FIELD } from '@/constants/tokens';
import type { AsmStep } from '@/types';

const ASTEPS: AsmStep[] = ['elig', 'site', 'gps', 'docs', 'done'];

const ELIG = [
  'I hold a valid national ID (KYC verified)',
  'My site is registered or part of a cooperative',
  'The site sits within an eligible region',
  'I have completed Level 1 safety training',
];

const ADOCS = [
  { k: 'id', label: 'National ID', meta: 'Owner or cooperative lead' },
  {
    k: 'licence',
    label: 'Mining licence or cooperative certificate',
    meta: 'Proves the site is lawfully operated',
  },
  { k: 'photos', label: 'Site photographs', meta: 'Three or more showing the working area' },
];

const TITLES: Record<AsmStep, [string, string]> = {
  elig: ['Check your eligibility', 'Confirm what applies to your operation.'],
  site: ['Your mining site', 'Tell us where you work and what you extract.'],
  gps: ['GPS validation', 'Capture the coordinates of your working area.'],
  docs: ['Supporting documents', 'Upload proof so we can verify your site.'],
  done: ['Registration submitted', 'Your site is queued for a field visit.'],
};

const OFF_BG = '#eef1f8';
const OFF_FG = '#5b638a';

const mChip = (on: boolean) =>
  'padding:10px 16px; border-radius:11px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer;';

/** View model for the five-step artisanal site registration. */
export function useAsmViewModel() {
  const { state, setState, go } = useAppState();

  return useMemo(() => {
    const ai = ASTEPS.indexOf(state.asmStep);
    const pickedMinerals = Object.keys(state.asmMin).filter((k) => state.asmMin[k]);
    const eligCount = ELIG.filter((_, i) => state.asmElig[i]).length;
    const docsDone = ADOCS.every((d) => state.asmDocs[d.k]);
    const siteOk =
      !!(state.asmForm.site || '').trim() &&
      !!(state.asmForm.country || '').trim() &&
      pickedMinerals.length > 0;

    const ctaMap: Record<AsmStep, [string, string, string, boolean]> = {
      elig: ['Continue', '#1e2a5a', '#fff', false],
      site: [
        siteOk ? 'Continue' : 'Add site name, country and minerals',
        siteOk ? '#1e2a5a' : OFF_BG,
        siteOk ? '#fff' : OFF_FG,
        !siteOk,
      ],
      gps: [
        state.asmGps ? 'Continue' : 'Capture location first',
        state.asmGps ? '#1e2a5a' : OFF_BG,
        state.asmGps ? '#fff' : OFF_FG,
        !state.asmGps,
      ],
      docs: [
        docsDone ? 'Submit registration' : 'Upload all documents',
        docsDone ? '#16a34a' : OFF_BG,
        docsDone ? '#fff' : OFF_FG,
        !docsDone,
      ],
      done: ['Go to Mining hub', '#1e2a5a', '#fff', false],
    };
    const aCta = ctaMap[state.asmStep];
    const titles = TITLES[state.asmStep];

    const asm = {
      isElig: state.asmStep === 'elig',
      isSite: state.asmStep === 'site',
      isGps: state.asmStep === 'gps',
      isDocs: state.asmStep === 'docs',
      isDone: state.asmStep === 'done',
      progress: Math.round(((ai + 1) / ASTEPS.length) * 100) + '%',
      stepLabel: 'Step ' + (ai + 1) + ' of 5',
      title: titles[0],
      sub: titles[1],
      ctaLabel: aCta[0],
      ctaBlocked: aCta[3],
      ctaStyle:
        'height:54px; padding:0 34px; border:none; border-radius:13px; font-size:15.5px; font-weight:800; background:' +
        aCta[1] +
        '; color:' +
        aCta[2] +
        '; cursor:' +
        (aCta[3] ? 'not-allowed' : 'pointer') +
        ';',
      canBack: ai > 0 && state.asmStep !== 'done',
      eligShort: eligCount < ELIG.length,
      gpsLocked: state.asmGps,
      gpsPending: !state.asmGps,
      gpsCta: state.asmGps ? 'Recapture location' : 'Capture GPS location',
      coords: '−11.6604, 27.4794',
    };

    return {
      lbl: FIELD.lbl,
      inp: FIELD.inp,
      asm,
      asmForm: state.asmForm,
      asmElig: ELIG.map((v, i) => {
        const on = !!state.asmElig[i];
        return {
          i,
          v,
          on,
          box:
            'width:22px; height:22px; border-radius:7px; flex-shrink:0; display:flex; align-items:center; justify-content:center; border:1.6px solid ' +
            (on ? '#16a34a' : '#cdd4e6') +
            '; background:' +
            (on ? '#16a34a' : '#fff') +
            ';',
          rowStyle:
            'display:flex; align-items:flex-start; gap:14px; width:100%; padding:16px 18px; border-radius:14px; cursor:pointer; border:1.5px solid ' +
            (on ? '#a7e0bd' : '#e7eaf3') +
            '; background:' +
            (on ? '#f4fbf7' : '#fff') +
            '; transition:all .18s ease;',
          toggle: () => setState((s) => ({ asmElig: { ...s.asmElig, [i]: !s.asmElig[i] } })),
        };
      }),
      asmMinerals: ['Gold', 'Silver', 'Copper', 'Diamond', 'Emerald', 'Quartz'].map((l) => ({
        label: l,
        style: mChip(!!state.asmMin[l]),
        toggle: () => setState((s) => ({ asmMin: { ...s.asmMin, [l]: !s.asmMin[l] } })),
      })),
      asmDocs: ADOCS.map((d) => {
        const done = !!state.asmDocs[d.k];
        return {
          k: d.k,
          label: d.label,
          meta: d.meta,
          done,
          pending: !done,
          bg: done ? '#dcf3e8' : '#f2f4fa',
          color: done ? '#16a34a' : '#8b95b4',
          chipLabel: done ? 'Uploaded' : 'Upload',
          chip:
            'font-size:11.5px; font-weight:800; padding:6px 13px; border-radius:9px; white-space:nowrap; ' +
            (done ? 'color:#16a34a; background:#dcf3e8;' : 'color:#1e2a5a; background:#eef1fb;'),
          rowStyle:
            'display:flex; align-items:center; gap:15px; width:100%; padding:17px 19px; border-radius:15px; cursor:pointer; text-align:left; border:1.5px solid ' +
            (done ? '#a7e0bd' : '#e7eaf3') +
            '; background:#fff;',
          upload: () => setState((s) => ({ asmDocs: { ...s.asmDocs, [d.k]: true } })),
        };
      }),
      asmSummary: [
        { k: 'Site', v: state.asmForm.site || '—' },
        {
          k: 'Location',
          v: [state.asmForm.region, state.asmForm.country].filter(Boolean).join(', ') || '—',
        },
        { k: 'Minerals', v: pickedMinerals.join(', ') || '—' },
        { k: 'Workers', v: String(state.asmForm.workers || 0) },
        { k: 'GPS', v: state.asmGps ? 'Captured' : 'Not captured' },
      ],
      asmSite: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ asmForm: { ...s.asmForm, site: e.target.value } })),
      asmCountry: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ asmForm: { ...s.asmForm, country: e.target.value } })),
      asmRegion: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ asmForm: { ...s.asmForm, region: e.target.value } })),
      asmWorkers: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({
          asmForm: {
            ...s.asmForm,
            workers: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0,
          },
        })),
      asmWorkersDec: () =>
        setState((s) => ({
          asmForm: { ...s.asmForm, workers: Math.max(0, (s.asmForm.workers || 0) - 1) },
        })),
      asmWorkersInc: () =>
        setState((s) => ({
          asmForm: { ...s.asmForm, workers: (s.asmForm.workers || 0) + 1 },
        })),
      asmGpsToggle: () => setState((s) => ({ asmGps: !s.asmGps })),
      asmBack: () => {
        const i = ASTEPS.indexOf(state.asmStep);
        if (i <= 0) {
          go('mining');
          return;
        }
        setState({ asmStep: ASTEPS[i - 1] });
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      },
      asmNext: () => {
        const i = ASTEPS.indexOf(state.asmStep);
        if (state.asmStep === 'site' && !siteOk) return;
        if (state.asmStep === 'gps' && !state.asmGps) return;
        if (state.asmStep === 'docs' && !docsDone) return;
        if (state.asmStep === 'done') {
          setState({ asmStep: 'elig' });
          go('mining');
          return;
        }
        setState({ asmStep: ASTEPS[i + 1] });
        requestAnimationFrame(() => window.scrollTo({ top: 0 }));
      },
    };
  }, [
    state.asmStep,
    state.asmElig,
    state.asmMin,
    state.asmDocs,
    state.asmGps,
    state.asmForm,
    setState,
    go,
  ]);
}
