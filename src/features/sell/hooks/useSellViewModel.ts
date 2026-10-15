import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { useActions } from '@/hooks/useActions';
import { CATS, PRODUCTS } from '@/constants/catalog';
import { FIELD } from '@/constants/tokens';
import { money } from '@/utils/format';

/** Indicative gross rate the design applies to a seller's declared quantity. */
const INDICATIVE_RATE = 2410;
const SELLER_FEE = 0.02;

const pill = (on: boolean) =>
  'padding:12px 22px; border-radius:12px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:14px; font-weight:700; cursor:pointer;';

const STEP_DEFS = [
  { n: 1, title: 'Mineral details', sub: 'What you have to sell' },
  { n: 2, title: 'Your location', sub: 'Where we visit you' },
  { n: 3, title: 'Review', sub: 'Check and submit' },
  { n: 4, title: 'Submitted', sub: 'What happens next' },
];

const SELL_TITLES: Record<number, [string, string]> = {
  1: ['Mineral details', 'Tell us what you have. Our team verifies it in person before anything moves.'],
  2: ['Your location', 'Where should our verification team visit you?'],
  3: ['Review your submission', 'Check the details before you submit.'],
  4: ['Submitted', 'What happens next.'],
};

/** View model for the four-step "Sell a mineral" wizard. */
export function useSellViewModel() {
  const { state, setState, go } = useAppState();
  const h = useActions();

  return useMemo(() => {
    const ss = state.sellStep;
    const sf = state.sellForm;
    const isOther = sf.mineral === '__other';
    const resolvedMineral = isOther ? sf.customMineral || '' : sf.mineral || '';

    const sellSteps = STEP_DEFS.map((s) => {
      const done = ss > s.n;
      const cur = ss === s.n;
      const locked = s.n > ss;
      return {
        n: s.n,
        title: s.title,
        sub: s.sub,
        titleColor: done || cur ? '#141a2e' : '#a3abc4',
        dotLabel: done ? '✓' : String(s.n),
        dot:
          'width:27px; height:27px; border-radius:14px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12.5px; font-weight:800; background:' +
          (done ? '#16a34a' : cur ? '#1e2a5a' : '#eef1f8') +
          '; color:' +
          (done || cur ? '#fff' : '#8b95b4') +
          ';',
        rowStyle:
          'display:flex; align-items:flex-start; gap:13px; width:100%; background:none; border:none; padding:11px 0; text-align:left; cursor:' +
          (locked ? 'default' : 'pointer') +
          '; opacity:' +
          (locked ? '.55' : '1') +
          ';',
        locked,
        go: () => {
          if (s.n > state.sellStep) return;
          setState({ sellStep: s.n });
        },
      };
    });

    const sfQtyN = parseFloat(sf.qty) || 0;
    const sGross = sfQtyN * INDICATIVE_RATE;
    const sFeeV = sGross * SELLER_FEE;

    const sellNext = () => {
      const cur = state.sellStep;
      if (cur === 4) {
        setState({ sellStep: 1 });
        go('home');
        return;
      }
      if (!state.authed) {
        setState({
          modal: {
            title: 'Sign in to continue',
            body: 'Please sign in to sell your minerals to Mineral Bridge.',
            confirmLabel: 'Sign in',
            confirm: () =>
              setState({
                modal: null,
                authOpen: true,
                authMode: 'login',
                authStage: 'form',
                pendingResume: 'sell',
              }),
          },
        });
        return;
      }
      if (cur === 3) {
        h.requireKyc('submit a listing', () => setState({ sellStep: 4 }), 'sell');
        return;
      }
      if (cur === 1) {
        const missing: string[] = [];
        const chosen = sf.mineral === '__other' ? sf.customMineral || '' : sf.mineral || '';
        if (!chosen.trim()) missing.push('mineral name');
        if (!(parseFloat(sf.qty) > 0)) missing.push('a quantity greater than zero');
        if (missing.length) {
          setState({
            modal: {
              title: 'A few details missing',
              body: `Please enter ${missing.join(' and ')} so we can price your lot accurately.`,
              confirmLabel: 'Got it',
              confirm: () => setState({ modal: null }),
            },
          });
          return;
        }
      }
      setState({ sellStep: cur + 1 });
      requestAnimationFrame(() => window.scrollTo({ top: 0 }));
    };

    return {
      lbl: FIELD.lbl,
      inp: FIELD.inp,
      ta: FIELD.ta,
      sel: FIELD.sel,
      sellSteps,
      sellProgress: (ss / 4) * 100 + '%',
      sellProgressLabel: 'Step ' + ss + ' of 4',
      sellTitle: SELL_TITLES[ss][0],
      sellSubtitle: SELL_TITLES[ss][1],
      sellStep1: ss === 1,
      sellStep2: ss === 2,
      sellStep3: ss === 3,
      sellStep4: ss === 4,
      sellCanBack: ss > 1 && ss < 4,
      sellNextLabel:
        ss === 3 ? 'Submit for verification' : ss === 4 ? 'Back to home' : 'Continue',
      sellSummary: [
        { k: 'Mineral', v: resolvedMineral || '—' },
        { k: 'Category', v: sf.category },
        { k: 'Quantity', v: (sf.qty || '—') + ' ' + sf.unit },
        { k: 'Form', v: sf.form },
        {
          k: 'Verification location',
          v: (sf.city || 'Not set') + (sf.country ? ', ' + sf.country : ''),
        },
      ],
      sellNextSteps: [
        {
          n: '1',
          title: 'We contact you to arrange a visit',
          sub: 'Our verification team agrees a date and travels to your location.',
        },
        {
          n: '2',
          title: 'Verification on site',
          sub: 'The mineral is checked and confirmed in person, at your location.',
        },
        {
          n: '3',
          title: 'Packed and shipped to us',
          sub: 'Once verified, it is packed, sealed and sent to Mineral Bridge.',
        },
        {
          n: '4',
          title: 'Support arranges your payment',
          sub: 'Our support team contacts you directly to confirm and release payment.',
        },
      ],
      sellForm: sf,
      sellCatOpts: CATS.map((c) => ({ v: c.name, sel: sf.category === c.name })),
      sellUnitOpts: ['g', 'kg', 'oz', 'ct', 'MT'].map((u) => ({ v: u, sel: sf.unit === u })),
      sellMineralOpts: [{ v: '', label: 'Select a mineral…' }]
        .concat(PRODUCTS.map((p) => ({ v: p.name, label: p.name })))
        .concat([{ v: '__other', label: 'Other — not listed' }])
        .map((o) => ({ v: o.v, label: o.label, sel: sf.mineral === o.v })),
      sellIsOther: isOther,
      sellMineralLabel: resolvedMineral || 'your mineral',
      sellFormOpts: ['Raw', 'Semi-finished', 'Finished'].map((o) => ({
        label: o,
        style: pill(sf.form === o),
        select: () => setState((s) => ({ sellForm: { ...s.sellForm, form: o } })),
      })),
      sellSlotOpts: ['Morning', 'Afternoon', 'Flexible'].map((o) => ({
        label: o,
        style: pill(sf.slot === o),
        select: () => setState((s) => ({ sellForm: { ...s.sellForm, slot: o } })),
      })),
      sellPhotos: [0, 1, 2, 3].map((i) => ({
        i,
        bg: i < 2 ? 'linear-gradient(140deg,#f3d27a,#b8860b)' : '#eef1f8',
      })),
      sellGross: money(sGross),
      sellFee: money(sFeeV),
      sellNet: money(sGross - sFeeV),
      sellBack: () => setState((s) => ({ sellStep: Math.max(1, s.sellStep - 1) })),
      sellNext,
      sfMineralPick: (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value;
        const p = PRODUCTS.find((x) => x.name === v);
        setState((s) => ({
          sellForm: {
            ...s.sellForm,
            mineral: v,
            category: p ? p.category : s.sellForm.category,
            customMineral: v === '__other' ? s.sellForm.customMineral : '',
          },
        }));
      },
      sfCustomMineral: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, customMineral: e.target.value } })),
      sfCategory: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, category: e.target.value } })),
      sfQty: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({
          sellForm: { ...s.sellForm, qty: e.target.value.replace(/[^0-9.]/g, '') },
        })),
      sfUnit: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, unit: e.target.value } })),
      sfCity: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, city: e.target.value } })),
      sfCountry: (e: React.ChangeEvent<HTMLInputElement>) =>
        setState((s) => ({ sellForm: { ...s.sellForm, country: e.target.value } })),
    };
  }, [state.sellStep, state.sellForm, state.authed, setState, go, h]);
}
