import { useMemo } from 'react';
import { useTradeState } from '@/hooks/useAppState';
import { money } from '@/utils/format';
import { SHIP_EVENTS } from '@/features/trade/constants';

/** View model for shipment tracking: custody timeline and consignment details. */
export function useShipmentViewModel() {
  const { ct, go } = useTradeState();

  return useMemo(() => {
    const total = (parseFloat(ct.price) || 0) * (parseFloat(ct.qty) || 0);

    return {
      lot: ct.lot,
      ref: 'B/L MEDU 4471882 · LC-2026-0419',
      from: 'Tema, GH',
      to: (ct.port || 'Durban') + ', ZA',
      departed: '06 Oct',
      eta: '17 Oct 2026',
      progress: '62%',
      openLc: () => go('lc'),
      events: SHIP_EVENTS.map((e, i) => {
        const s = i < 3 ? 'done' : i === 3 ? 'cur' : 'todo';
        return {
          title: e[0],
          who: e[1],
          where: e[2],
          time: e[3],
          hash: e[4],
          done: s === 'done',
          current: s === 'cur',
          color: s === 'todo' ? '#5b638a' : '#141a2e',
          dot:
            'width:28px; height:28px; border-radius:14px; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; background:' +
            (s === 'done' ? '#16a34a' : s === 'cur' ? '#2563eb' : '#eef1f8') +
            ';',
          hasLine: i < SHIP_EVENTS.length - 1,
          line:
            'width:2px; flex:1; min-height:30px; background:' + (i < 2 ? '#16a34a' : '#eef1f8') + ';',
        };
      }),
      details: [
        { k: 'Vessel', v: 'MSC Aurora · Voy 226W' },
        { k: 'Bill of lading', v: 'MEDU 4471882' },
        { k: 'Container', v: 'MSCU 7720154' },
        { k: 'Seal', v: 'MB-SEAL-00941' },
        { k: 'Incoterm', v: ct.incoterm + ' ' + ct.port },
        { k: 'Insured value', v: money(total * 1.1) },
      ],
    };
  }, [ct, go]);
}
