import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { CHIP } from '@/constants/tokens';
import { chipStyle, formatDate, money } from '@/utils/format';
import { LC_DOCS, tradeBtn } from '@/features/trade/constants';
import { useLcState } from '@/features/trade/hooks/useLcViewModel';

/** The issuing bank's book of LC applications. */
const BANK_ROWS = [
  { id: 'LC-2026-0419', app: 'Marvel Trading Co.', ben: '', amt: 0, main: true, def: '' },
  {
    id: 'LC-2026-0402',
    app: 'Rand Metals Ltd',
    ben: 'Katanga Minerals',
    amt: 366000,
    main: false,
    def: 'Applied',
  },
  {
    id: 'LC-2026-0388',
    app: 'Gulf Gem House',
    ben: 'Kagem Mining Coop',
    amt: 452620,
    main: false,
    def: 'Issued',
  },
  {
    id: 'LC-2026-0371',
    app: 'Orion Alloys',
    ben: 'Bikita Lithium Ltd',
    amt: 112000,
    main: false,
    def: 'Confirmed',
  },
];

const STATUS_CHIP: Record<string, readonly [string, string]> = {
  Applied: CHIP.GREY,
  Issued: CHIP.BLUE,
  Advised: CHIP.AMBER,
  Confirmed: CHIP.GREEN,
};

const actionStyle = (on: boolean) =>
  'height:34px; padding:0 12px; border-radius:9px; font-size:12px; font-weight:800; white-space:nowrap; border:1px solid ' +
  (on ? '#1e2a5a' : '#e7eaf3') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#8b95b4') +
  '; cursor:' +
  (on ? 'pointer' : 'not-allowed') +
  ';';

/** View model for the Bank Portal: LC applications and document examination. */
export function useBankViewModel() {
  const { state, setState, go } = useAppState();
  const { ct, total, blDate, lateBL, disc, ok } = useLcState();

  return useMemo(() => {
    const note = (t: string, b: string) =>
      setState({
        modal: { title: t, body: b, confirmLabel: 'Done', confirm: () => setState({ modal: null }) },
      });

    const adv = (r: (typeof BANK_ROWS)[number], to: string) => {
      if (r.main) setState({ lcStatus: to });
      else setState((s) => ({ bankStatus: { ...s.bankStatus, [r.id]: to } }));
      note(r.id + ' ' + to.toLowerCase(), 'All parties on ' + r.id + ' have been notified.');
    };

    const VAL: Record<string, string> = {
      invoice: money(total),
      bl: 'On board ' + formatDate(blDate) + ' · MEDU 4471882',
      packing: (parseFloat(ct.qty) || 0).toLocaleString('en-US') + ' ' + ct.unit + ' · 7 sealed units',
      origin: 'Ghana',
      assay: '91.6% Au · SGS Accra',
      insurance: money(total * 1.1) + ' cover',
      inspection: 'Seal MB-SEAL-00941 intact',
    };

    const exReady = state.lcPresented || !!state.lcExam;

    const res: [string, string, readonly [string, string]] | null = state.lcPaid
      ? [
          'Payment released',
          money(total) + ' paid to ' + ct.seller + '. Settlement hash 0x9d21…4b7a recorded on-chain.',
          CHIP.GREEN,
        ]
      : state.lcExam === 'accepted'
        ? [
            'Documents accepted',
            'Complying presentation. Release payment to complete settlement.',
            CHIP.GREEN,
          ]
        : state.lcExam === 'refused'
          ? [
              'Presentation refused',
              'The beneficiary has been notified of the discrepancies.',
              ['#fdecec', '#b91c1c'] as const,
            ]
          : null;

    return {
      tabs: (
        [
          ['apps', 'LC applications'],
          ['exam', 'Document examination'],
        ] as const
      ).map(([k, l]) => {
        const on = state.bankTab === k;
        return {
          k,
          label: l,
          select: () => setState({ bankTab: k }),
          style:
            'padding:11px 20px; border:none; background:none; cursor:pointer; font-size:14.5px; font-weight:800; border-bottom:2.5px solid ' +
            (on ? '#1e2a5a' : 'transparent') +
            '; color:' +
            (on ? '#141a2e' : '#5b638a') +
            ';',
        };
      }),
      isApps: state.bankTab === 'apps',
      isExam: state.bankTab === 'exam',
      examEmpty: !exReady,
      examReady: exReady,
      goLc: () => go('lc'),
      rows: BANK_ROWS.map((r) => {
        const s = r.main ? state.lcStatus : state.bankStatus[r.id] || r.def;
        const c = STATUS_CHIP[s] || CHIP.GREY;
        const A: [string, boolean, () => void][] = [
          ['Issue', s === 'Applied', () => adv(r, 'Issued')],
          ['Advise', s === 'Issued', () => adv(r, 'Advised')],
          ['Confirm', s === 'Advised', () => adv(r, 'Confirmed')],
          [
            'Amend',
            s !== 'Applied',
            () =>
              note(
                'Amendment drafted',
                'An amendment request for ' + r.id + ' has been sent to the applicant for approval.',
              ),
          ],
        ];
        return {
          id: r.id,
          app: r.app,
          ben: r.main ? ct.seller : r.ben,
          amount: money(r.main ? total : r.amt),
          status: s,
          chip: chipStyle(c[0], c[1]),
          actions: A.map(([l, on, fn]) => ({
            label: l,
            blocked: !on,
            style: actionStyle(on),
            go: () => {
              if (on) fn();
            },
          })),
        };
      }),
      terms: [
        { k: 'Credit amount', v: 'Up to ' + money(total) },
        { k: 'Goods', v: ct.lot },
        { k: 'Incoterm', v: ct.incoterm + ' ' + ct.port },
        { k: 'Latest shipment', v: formatDate(ct.to) },
        { k: 'Expiry', v: '05 Nov 2026' },
        { k: 'Presentation period', v: (ct.presentation || '—') + ' days after shipment' },
        { k: 'Tenor', v: ct.tenor },
      ],
      docs: LC_DOCS.map(([k, n]) => {
        const up = !!state.lcDocs[k];
        const bad = !up || (k === 'bl' && lateBL);
        return {
          k,
          name: n,
          val: up ? VAL[k] + (bad ? ' — after latest shipment date' : '') : 'Not presented',
          ok: !bad,
          bad,
          valColor: bad ? '#b91c1c' : '#6b7290',
          mark:
            'width:26px; height:26px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#fff; background:' +
            (bad ? '#dc2626' : '#16a34a') +
            ';',
        };
      }),
      summary: ok
        ? 'Complying presentation — no discrepancies'
        : disc.length + (disc.length === 1 ? ' discrepancy' : ' discrepancies') + ' found',
      sumDot:
        'width:12px; height:12px; border-radius:6px; flex-shrink:0; background:' +
        (ok ? '#16a34a' : '#dc2626') +
        ';',
      acceptBlocked: !ok || !!state.lcExam,
      refuseBlocked: !!state.lcExam,
      releaseBlocked: !(state.lcExam === 'accepted' && !state.lcPaid),
      acceptStyle: tradeBtn(ok && !state.lcExam),
      releaseStyle: tradeBtn(state.lcExam === 'accepted' && !state.lcPaid, '#16a34a'),
      refuseStyle:
        'height:50px; padding:0 22px; border-radius:13px; font-size:14.5px; font-weight:800; border:1px solid ' +
        (state.lcExam ? '#eef1f8' : '#f3c8c8') +
        '; background:#fff; color:' +
        (state.lcExam ? '#5b638a' : '#b91c1c') +
        '; cursor:' +
        (state.lcExam ? 'not-allowed' : 'pointer') +
        ';',
      accept: () => {
        if (ok && !state.lcExam) setState({ lcExam: 'accepted' });
      },
      refuse: () => {
        if (!state.lcExam) setState({ lcExam: 'refused', lcPresented: false });
      },
      release: () => {
        if (state.lcExam === 'accepted' && !state.lcPaid) setState({ lcPaid: true });
      },
      hasResult: !!res,
      resultTitle: res ? res[0] : '',
      resultBody: res ? res[1] : '',
      resultStyle: res
        ? 'margin-top:14px; border-radius:14px; padding:16px 20px; background:' +
          res[2][0] +
          '; border-left:4px solid ' +
          res[2][1] +
          ';'
        : '',
    };
  }, [
    state.bankTab,
    state.lcStatus,
    state.bankStatus,
    state.lcDocs,
    state.lcPresented,
    state.lcExam,
    state.lcPaid,
    ct,
    total,
    blDate,
    lateBL,
    disc,
    ok,
    setState,
    go,
  ]);
}
