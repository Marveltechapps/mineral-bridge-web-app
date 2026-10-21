import { useMemo } from 'react';
import { useAccountState, useTradeState } from '@/hooks/useAppState';
import { isApiConfigured } from '@/lib/api/config';
import { CHIP } from '@/constants/tokens';
import { chipStyle, formatDate, money } from '@/utils/format';
import {
  LC_DOCS,
  LC_MILESTONES,
  LC_STATUS_ORDER,
  tradeBtn,
  tradePill,
} from '@/features/trade/constants';

/** Bill-of-lading on-board dates offered by the design's demo control. */
const BL_DATES = { ontime: '2026-10-06', late: '2026-10-18' } as const;

/**
 * Shared LC derivation used by both the LC Workspace and the Bank Portal:
 * the on-board date, the discrepancy list and whether the presentation complies.
 */
export function useLcState() {
  const { ct, lcBLDate, lcDocs } = useTradeState();
  const total = (parseFloat(ct.price) || 0) * (parseFloat(ct.qty) || 0);
  const blDate = BL_DATES[lcBLDate];
  const lateBL = blDate > (ct.to || '');

  const disc = LC_DOCS.filter((d) => !lcDocs[d[0]]).map((d) => d[1] + ' not presented');
  if (lcDocs.bl && lateBL) {
    disc.push(
      'Bill of lading on-board date (' +
        formatDate(blDate) +
        ') is after the latest shipment date (' +
        formatDate(ct.to) +
        ')',
    );
  }

  return { ct, total, blDate, lateBL, disc, ok: disc.length === 0 };
}

/** View model for the LC Workspace: milestones, checklist and presentation. */
export function useLcViewModel() {
  const {
    lcStatus,
    lcDocs,
    lcBLDate,
    lcCheck,
    lcPresented,
    lcExam,
    lcPaid,
    setState,
    go,
  } = useTradeState();
  const { accForm } = useAccountState();
  const company = accForm.company;
  const { ct, total, disc, ok } = useLcState();

  return useMemo(() => {
    const si = LC_STATUS_ORDER.indexOf(lcStatus);
    const done = [
      true,
      si >= 1,
      si >= 2,
      si >= 3,
      si >= 3,
      lcPresented || lcExam === 'accepted',
      lcExam === 'accepted',
      lcPaid,
    ];
    const cur = done.indexOf(false);
    const canPresent = lcCheck && ok && si >= 3 && !lcPresented && !lcPaid;

    const lcChip = lcPaid
      ? CHIP.GREEN
      : lcExam === 'refused'
        ? (['#fdecec', '#b91c1c'] as const)
        : si >= 3
          ? CHIP.BLUE
          : CHIP.AMBER;

    return {
      hasLc: Boolean(ct.lot),
      headline: ct.lot
        ? ct.lcType + ' · ' + ct.tenor + ' · ' + money(total)
        : 'No letter of credit is open yet',
      statusLabel: lcPaid
        ? 'PAID'
        : lcExam === 'refused'
          ? 'REFUSED'
          : lcPresented
            ? 'UNDER EXAMINATION'
            : lcStatus.toUpperCase(),
      statusChip: chipStyle(lcChip[0], lcChip[1]),
      milestones: LC_MILESTONES.map((l, i) => {
        const s = done[i] ? 'done' : i === cur ? 'cur' : 'todo';
        return {
          label: l,
          n: String(i + 1),
          done: s === 'done',
          notDone: s !== 'done',
          color: s === 'todo' ? '#5b638a' : '#141a2e',
          wrap:
            'display:flex; flex-direction:column; flex:' +
            (i < LC_MILESTONES.length - 1 ? '1' : '0 0 auto') +
            '; min-width:0;',
          dot:
            'width:30px; height:30px; border-radius:15px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; background:' +
            (s === 'done' ? '#16a34a' : s === 'cur' ? '#1e2a5a' : '#eef1f8') +
            '; color:' +
            (s === 'todo' ? '#5b638a' : '#fff') +
            ';',
          line:
            i < LC_MILESTONES.length - 1
              ? 'flex:1; height:3px; border-radius:2px; margin:0 6px; background:' +
                (done[i] && done[i + 1] ? '#16a34a' : '#e7eaf3') +
                ';'
              : 'display:none;',
        };
      }),
      docs: LC_DOCS.map(([k, n, s]) => {
        const up = !!lcDocs[k];
        return {
          k,
          name: n,
          sub: s,
          up,
          chip: up ? chipStyle(CHIP.GREEN[0], CHIP.GREEN[1]) : chipStyle(CHIP.GREY[0], CHIP.GREY[1]),
          chipLabel: up ? 'UPLOADED' : 'REQUIRED',
          btnLabel: up ? 'Remove' : 'Upload',
          toggle: () =>
            setState((x) => ({ lcDocs: { ...x.lcDocs, [k]: !x.lcDocs[k] }, lcCheck: false })),
        };
      }),
      blOpts: (
        [
          ['ontime', '06 Oct 2026'],
          ['late', '18 Oct 2026'],
        ] as const
      ).map(([k, l]) => ({
        label: l,
        style: tradePill(lcBLDate === k),
        select: () => setState({ lcBLDate: k, lcCheck: false }),
      })),
      precheck: () => setState({ lcCheck: true }),
      compliant: lcCheck && ok,
      discrepant: lcCheck && !ok,
      disc: disc.map((v) => ({ v })),
      discTitle: disc.length + (disc.length === 1 ? ' discrepancy' : ' discrepancies') + ' found',
      refused: lcExam === 'refused',
      details: [
        { k: 'LC number', v: isApiConfigured() ? 'Not issued yet' : 'LC-2026-0419' },
        { k: 'Applicant', v: company.trim() || (isApiConfigured() ? 'Your account' : 'Marvel Trading Co.') },
        { k: 'Beneficiary', v: ct.seller },
        { k: 'Issuing bank', v: ct.bank || '—' },
        { k: 'Advising bank', v: isApiConfigured() ? '—' : 'Ghana Commercial Bank' },
        { k: 'Amount', v: money(total) },
        { k: 'Incoterm', v: ct.incoterm + ' ' + ct.port },
        { k: 'Latest shipment', v: ct.to ? formatDate(ct.to) : '—' },
        { k: 'Expiry', v: isApiConfigured() ? '—' : '05 Nov 2026' },
        { k: 'Presentation', v: (ct.presentation || '—') + ' days' },
      ],
      presentBlocked: !canPresent,
      presentStyle: tradeBtn(canPresent, '#16a34a') + ' width:100%; margin-top:14px;',
      presentLabel: lcPaid
        ? 'Payment released'
        : lcPresented
          ? 'Presented to bank'
          : 'Present documents to bank',
      presentHint: lcPaid
        ? 'Settlement complete.'
        : si < 3
          ? 'The LC must be confirmed in the Bank Portal before documents can be presented.'
          : lcPresented
            ? 'With the issuing bank for examination.'
            : !lcCheck
              ? 'Run the pre-check first.'
              : !ok
                ? 'Resolve the discrepancies, then re-run the pre-check.'
                : 'Ready to present.',
      present: () => {
        if (!canPresent) return;
        setState({
          lcPresented: true,
          lcExam: null,
          modal: {
            title: 'Documents presented',
            body: 'The issuing bank will examine the presentation against the LC terms.',
            confirmLabel: 'Open Bank Portal',
            confirm: () => {
              setState({ modal: null, bankTab: 'exam' });
              go('bank');
            },
          },
        });
      },
      goBank: () => go('bank'),
      goShip: () => go('shipment'),
    };
  }, [
    lcStatus,
    lcDocs,
    lcBLDate,
    lcCheck,
    lcPresented,
    lcExam,
    lcPaid,
    ct,
    total,
    disc,
    ok,
    accForm.company,
    setState,
    go,
  ]);
}
