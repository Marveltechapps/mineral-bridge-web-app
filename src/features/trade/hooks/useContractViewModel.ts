import { useMemo } from 'react';
import { useTradeState } from '@/hooks/useAppState';
import { CHIP } from '@/constants/tokens';
import { chipStyle, formatDate, money } from '@/utils/format';
import { tradeBtn, tradePill } from '@/features/trade/constants';
import type { ContractTerms } from '@/types';

const INCOTERM_DESC: Record<string, string> = {
  EXW: 'Ex Works — the buyer collects from the seller’s premises and carries all risk.',
  FCA: 'Free Carrier — the seller hands the goods to the buyer’s nominated carrier.',
  FOB: 'Free On Board — risk passes to the buyer once goods are loaded on the vessel.',
  CIF: 'Cost, Insurance & Freight — the seller pays freight and insurance to the named port.',
  DAP: 'Delivered At Place — the seller delivers to the named destination, ready for unloading.',
};

/** On-chain hash the design records against a signed contract. */
const CONTRACT_HASH = '0x7a3f9c41…e2c19e';

/** View model for the Contract Builder and its live document preview. */
export function useContractViewModel() {
  const { ct, ctSigned, setState, go } = useTradeState();

  return useMemo(() => {
    const locked = ctSigned;

    const setCt = (k: keyof ContractTerms, v: string) => {
      if (ctSigned) return;
      setState((s) => ({ ct: { ...s.ct, [k]: v } }));
    };

    const total = (parseFloat(ct.price) || 0) * (parseFloat(ct.qty) || 0);
    const valid =
      total > 0 && !!ct.from && !!ct.to && !!(ct.port || '').trim() && !!(ct.bank || '').trim();

    const mk = (key: keyof ContractTerms, opts: string[]) =>
      opts.map((o) => ({
        label: o,
        style: tradePill(ct[key] === o, locked),
        select: () => setCt(key, o),
      }));

    return {
      f: ct,
      locked,
      signed: locked,
      notSigned: !locked,
      incoterms: mk('incoterm', ['EXW', 'FCA', 'FOB', 'CIF', 'DAP']),
      units: mk('unit', ['oz', 'kg', 'MT', 'ct']),
      lcTypes: mk('lcType', ['Irrevocable', 'Confirmed', 'Standby']),
      tenors: mk('tenor', ['At sight', '30 days', '60 days', '90 days']),
      incotermDesc: INCOTERM_DESC[ct.incoterm],
      onPrice: (e: React.ChangeEvent<HTMLInputElement>) =>
        setCt('price', e.target.value.replace(/[^0-9.]/g, '')),
      onQty: (e: React.ChangeEvent<HTMLInputElement>) =>
        setCt('qty', e.target.value.replace(/[^0-9.]/g, '')),
      onPort: (e: React.ChangeEvent<HTMLInputElement>) => setCt('port', e.target.value),
      onFrom: (e: React.ChangeEvent<HTMLInputElement>) => setCt('from', e.target.value),
      onTo: (e: React.ChangeEvent<HTMLInputElement>) => setCt('to', e.target.value),
      onBank: (e: React.ChangeEvent<HTMLInputElement>) => setCt('bank', e.target.value),
      onPres: (e: React.ChangeEvent<HTMLInputElement>) =>
        setCt('presentation', e.target.value.replace(/[^0-9]/g, '')),
      inp:
        'width:100%; height:48px; border:1px solid #dde2f0; border-radius:12px; padding:0 14px; font-size:14.5px; color:#141a2e; outline:none; background:' +
        (locked ? '#f4f5f9' : '#fff') +
        ';',
      qtyLabel: (parseFloat(ct.qty) || 0).toLocaleString('en-US') + ' ' + ct.unit,
      priceLabel: money(Number(ct.price)) + ' per ' + ct.unit,
      fromLabel: formatDate(ct.from),
      toLabel: formatDate(ct.to),
      tenorLabel:
        ct.tenor === 'At sight' ? 'at sight' : ct.tenor + ' after the bill of lading date',
      total: money(total),
      statusLabel: locked ? 'SIGNED' : 'DRAFT',
      statusStyle: locked
        ? chipStyle(CHIP.GREEN[0], CHIP.GREEN[1])
        : chipStyle(CHIP.AMBER[0], CHIP.AMBER[1]),
      buyerSig: locked ? 'Marvel Tech · 10 Oct 2026' : 'Awaiting signature',
      sellerSig: locked ? 'Counter-signature requested' : 'Awaiting signature',
      hash: CONTRACT_HASH,
      signBlocked: !valid,
      signStyle: tradeBtn(valid) + ' width:100%; margin-top:16px;',
      signHint: locked
        ? 'Terms are locked. Next, issue the Letter of Credit.'
        : valid
          ? 'Signing locks the terms and records a tamper-proof hash on-chain.'
          : 'Add price, quantity, port, shipment window and issuing bank to sign.',
      sign: () => {
        if (!valid || locked) return;
        setState({
          modal: {
            title: 'Sign this contract?',
            body: 'You are signing as Marvel Tech for Marvel Trading Co. Terms will be locked and a hash recorded on-chain.',
            confirmLabel: 'Sign contract',
            confirm: () =>
              setState((s) => ({
                ctSigned: true,
                ctFor: s.ctFor || s.negId,
                modal: {
                  title: 'Contract signed',
                  body: `Hash ${CONTRACT_HASH} is recorded on-chain. Next, set up the Letter of Credit.`,
                  confirmLabel: 'Open LC Workspace',
                  confirm: () => {
                    setState({ modal: null });
                    go('lc');
                  },
                },
              })),
          },
        });
      },
      openLc: () => go('lc'),
    };
  }, [ct, ctSigned, setState, go]);
}
