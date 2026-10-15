import { useMemo } from 'react';
import { useAppState } from '@/hooks/useAppState';
import { ORDERS } from '@/constants/orders';
import { stageIndexFor, stagesFor } from '@/constants/catalog';

/** Timestamps the design attaches to each reached pipeline stage. */
const TIMES = [
  '11 Jun · 09:14',
  '11 Jun · 14:02',
  '12 Jun · 08:30',
  '12 Jun · 10:18',
  '13 Jun · 16:45',
  '',
];

/** View model for a single order's tracking screen. */
export function useOrderDetailViewModel() {
  const { state, setState } = useAppState();

  return useMemo(() => {
    const to = ORDERS.find((o) => o.id === state.trackId) || ORDERS[0];
    const STAGES = stagesFor(to.side);
    const stageIdx = stageIndexFor(to.side, to.progress);
    const rej = !!to.rejected;

    const history = STAGES.map((s, i, arr) => {
      const done = i < stageIdx;
      // A terminated order stops at the rejection point — never "in progress".
      const cur = !rej && i === stageIdx;
      const term = rej && i === stageIdx;
      const reached = done || cur || term;
      return {
        title: term ? s.title + ' — not passed' : s.title,
        sub: term
          ? 'Verification could not be completed, so the order was terminated here.'
          : s.sub,
        done,
        current: cur,
        terminated: term,
        time: reached ? TIMES[i] : '',
        color: term ? '#b91c1c' : reached ? '#141a2e' : '#a3abc4',
        dot:
          'width:28px; height:28px; border-radius:14px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:' +
          (done ? '#16a34a' : cur ? '#2563eb' : term ? '#dc2626' : '#eef1f8') +
          ';',
        hasLine: i < arr.length - 1,
        line:
          'width:2px; flex:1; min-height:34px; background:' + (done ? '#16a34a' : '#eef1f8') + ';',
      };
    });

    const ROUTE =
      to.side === 'SELL'
        ? [
            { label: 'Your site', meta: to.region || 'Pickup point' },
            { label: 'Agent collection', meta: 'Sample sealed' },
            { label: 'Assay lab', meta: 'Nairobi Zone 0' },
            { label: 'MB vault', meta: 'Assured inventory' },
          ]
        : [
            { label: 'MB vault', meta: 'Assured inventory' },
            { label: 'Inspection hub', meta: 'Nairobi Zone 0' },
            { label: 'In transit', meta: 'Bonded carrier' },
            { label: 'Your facility', meta: 'Final delivery' },
          ];
    const routeIdx = Math.min(ROUTE.length - 1, Math.floor(stageIdx / 2));

    const route = ROUTE.map((r, i, arr) => {
      const done = i <= routeIdx;
      return {
        label: r.label,
        meta: r.meta,
        done,
        wrap: 'flex:' + (i < arr.length - 1 ? '1' : '0 0 auto') + '; min-width:0;',
        color: done ? '#141a2e' : '#a3abc4',
        dot:
          'width:26px; height:26px; border-radius:13px; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:' +
          (done ? '#16a34a' : '#eef1f8') +
          ';',
        hasLine: i < arr.length - 1,
        line:
          'flex:1; height:3px; border-radius:2px; margin:0 10px; background:' +
          (i < routeIdx ? '#16a34a' : '#eef1f8') +
          ';',
      };
    });

    const docReady = (i: number) => i <= stageIdx;

    const docDefs =
      to.side === 'SELL'
        ? [
            { name: 'Listing receipt', meta: 'PDF · 78 KB', i: 0 },
            { name: 'Dispatch & packing note', meta: 'PDF · 140 KB', i: 2 },
            { name: 'Goods received note', meta: 'PDF · 210 KB', i: 3 },
            { name: 'Verification report', meta: 'PDF · 96 KB', i: 1 },
            { name: 'Payout statement', meta: 'PDF · 74 KB', i: 5 },
          ]
        : [
            { name: 'Order confirmation', meta: 'PDF · 82 KB', i: 0 },
            { name: 'Verification report', meta: 'PDF · 165 KB', i: 1 },
            { name: 'Price confirmation', meta: 'PDF · 61 KB', i: 2 },
            { name: 'Escrow receipt', meta: 'PDF · 58 KB', i: 3 },
            { name: 'Assay certificate', meta: 'PDF · 210 KB', i: 4 },
            { name: 'Delivery note', meta: 'PDF · 91 KB', i: 5 },
          ];

    const track = {
      ...to,
      isRejected: rej,
      notRejected: !rej,
      progressBg: rej
        ? 'linear-gradient(90deg,#dc2626,#ef4444)'
        : 'linear-gradient(90deg,#7fe3a1,#16a34a)',
      stage: rej ? 'Rejected at verification' : STAGES[stageIdx].title,
      pipelineLabel: to.side === 'SELL' ? 'SELL PIPELINE' : 'BUY PIPELINE',
      stageColor: rej ? '#f3a6b8' : '#7fe3a1',
      reason: to.reason || '',
      sideStyle:
        'font-size:10.5px; font-weight:800; letter-spacing:.6px; padding:5px 11px; border-radius:8px; background:rgba(255,255,255,.16); color:#fff;',
      history,
      route,
      docs: docDefs.map((d) => {
        const ready = docReady(d.i);
        return {
          name: d.name,
          ready,
          meta: ready ? d.meta : 'Available at a later stage',
          bg: ready ? '#eef1fb' : '#f4f5f9',
          color: ready ? '#1e2a5a' : '#b3bad2',
          cursor: ready ? 'pointer' : 'default',
          download: () => {
            if (!ready) return;
            setState({
              modal: {
                title: d.name,
                body: 'Your document is being prepared and will download shortly.',
                confirmLabel: 'Done',
                confirm: () => setState({ modal: null }),
              },
            });
          },
        };
      }),
    };

    return { track };
  }, [state.trackId, setState]);
}
