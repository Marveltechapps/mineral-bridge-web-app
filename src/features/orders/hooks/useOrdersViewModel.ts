import { useMemo } from 'react';
import { useOrdersState } from '@/hooks/useAppState';
import { ORDERS, isClosed } from '@/constants/orders';
import { stageLabelFor } from '@/constants/catalog';

const oChip = (on: boolean) =>
  'padding:9px 18px; border-radius:10px; border:1px solid ' +
  (on ? '#1e2a5a' : '#dde2f0') +
  '; background:' +
  (on ? '#1e2a5a' : '#fff') +
  '; color:' +
  (on ? '#fff' : '#4a5170') +
  '; font-size:13px; font-weight:700; cursor:pointer;';

const oTab = (on: boolean) =>
  'padding:11px 22px; border:none; background:none; cursor:pointer; font-size:14.5px; font-weight:800; border-bottom:2.5px solid ' +
  (on ? '#1e2a5a' : 'transparent') +
  '; color:' +
  (on ? '#141a2e' : '#8b95b4') +
  ';';

/** View model for the "My Orders" list, its side filters and status tabs. */
export function useOrdersViewModel() {
  const { orderFilter, orderTab, setState, go } = useOrdersState();

  return useMemo(() => {
    const scoped = ORDERS.filter((o) =>
      orderTab === 'completed' ? isClosed(o) : !isClosed(o),
    );

    const orderRows = scoped
      .filter((o) => orderFilter === 'all' || o.side.toLowerCase() === orderFilter)
      .map((o) => ({
        ...o,
        stage: o.rejected ? 'Rejected at verification' : stageLabelFor(o.side, o.progress),
        progressBg: o.rejected
          ? 'linear-gradient(90deg,#dc2626,#ef4444)'
          : 'linear-gradient(90deg,#16a34a,#22c55e)',
        sideStyle:
          'justify-self:start; font-size:10.5px; font-weight:800; letter-spacing:.5px; padding:5px 11px; border-radius:8px; ' +
          (o.side === 'BUY'
            ? 'background:#dbeafe; color:#2563eb;'
            : 'background:#fdecd6; color:#b45309;'),
        statusStyle:
          'justify-self:start; font-size:11.5px; font-weight:800; padding:6px 13px; border-radius:9px; white-space:nowrap; color:' +
          o.sc +
          '; background:' +
          o.sbg +
          ';',
        open: () => {
          setState({ trackId: o.id });
          go('orderDetail');
        },
      }));

    return {
      orderFilters: [
        { k: 'all', label: 'All' },
        { k: 'buy', label: 'Buy' },
        { k: 'sell', label: 'Sell' },
      ].map((f) => ({
        k: f.k,
        label: f.label,
        style: oChip(orderFilter === f.k),
        select: () => setState({ orderFilter: f.k }),
      })),
      orderTabs: (
        [
          { k: 'active', label: 'Active (' + ORDERS.filter((o) => !isClosed(o)).length + ')' },
          { k: 'completed', label: 'Completed (' + ORDERS.filter(isClosed).length + ')' },
        ] as const
      ).map((t) => ({
        k: t.k,
        label: t.label,
        style: oTab(orderTab === t.k),
        select: () => setState({ orderTab: t.k }),
      })),
      orderCols: [
        { v: 'LOT' },
        { v: 'SIDE' },
        { v: 'QUANTITY' },
        { v: 'DATE' },
        { v: 'PIPELINE STAGE' },
        { v: 'STATUS' },
      ],
      orderRows,
      ordersEmpty: orderRows.length === 0,
      ordersEmptyMsg:
        orderTab === 'completed'
          ? 'No completed orders yet.'
          : 'No active orders right now.',
    };
  }, [orderFilter, orderTab, setState, go]);
}
