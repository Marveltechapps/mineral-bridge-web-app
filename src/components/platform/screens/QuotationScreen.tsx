// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function QuotationScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '16px', borderRadius: '22px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
          {vm.ov?.id}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>
          {vm.ov?.title}
        </div>
        <div style={{ fontSize: '12.5px', color: '#C9C7C0', marginTop: '3px' }}>
          {vm.ov?.qtyLine}
        </div>
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '16px', marginTop: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            QUOTATION
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11.5px' }}>
            {vm.q?.no}
          </span>
        </div>
        {list(vm.qLines).map((l, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <span>
              {l?.n}{" · "}{l?.q}
            </span>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: '600' }}>
              {l?.a}
            </span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '14px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            Total
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '22px', fontWeight: '600' }}>
            {vm.q?.total}
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '10px', lineHeight: '1.5' }}>
          {vm.qNote}
        </div>
        <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '6px' }}>
          {"Issued "}{vm.q?.issued}{" · valid until "}{vm.q?.valid}
        </div>
      </div>
      <div style={{ fontSize: '13px', color: '#3A3940', margin: '14px 4px 8px' }}>
        Questions about the price? Talk to the trading desk first.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: '6px' }}>
        {list(vm.contact).map((c, index) => (
          <div key={index} onClick={c?.tap} role="button" style={{ cursor: 'pointer', height: '44px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11.5px', fontWeight: '600' }}>
            <Val v={c?.l} />
          </div>
        ))}
      </div>
    </div>
  );
}
