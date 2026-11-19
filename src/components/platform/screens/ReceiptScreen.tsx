// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function ReceiptScreen({ vm }: { vm: ViewModel }) {
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
      <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13.5px' }}>
          <span style={{ color: '#6B6A70' }}>
            Expected quantity
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: '600' }}>
            {vm.rcExpected}
          </span>
        </div>
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '18px 4px 6px' }}>
        QUANTITY RECEIVED
      </label>
      <input aria-label="Quantity received" value={vm.rcQty ?? ''} onChange={vm.setRcQty} placeholder="e.g. 2 kg" style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px' }} />
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        CONDITION
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.rcConds).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        PHOTOS
      </div>
      <div onClick={vm.addRcPhoto} role="button" style={{ cursor: 'pointer', padding: '16px', borderRadius: '18px', border: '1.5px dashed #D5D3CC', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontWeight: '600' }}>
        <span>
          Add delivery photo
        </span>
        <span style={{ fontFamily: "'Geist Mono', monospace", color: '#8A6A1C' }}>
          {vm.rcPhotos}{" added"}
        </span>
      </div>
      <div style={{ marginTop: '18px', padding: '12px 14px', borderRadius: '14px', background: '#F1EFE9', fontSize: '12.5px', color: '#3A3940', lineHeight: '1.5' }}>
        <b>
          Something wrong?
        </b>
        {" Raise a discrepancy if the quantity or condition does not match. Mineral Bridge will either send the missing quantity or refund the difference. For other money-back requests, use Request a refund on the order."}
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '14px 4px 6px' }}>
        NOTE (NEEDED TO RAISE A DISCREPANCY)
      </label>
      <textarea aria-label="Delivery note" value={vm.rcNote ?? ''} onChange={vm.setRcNote} style={{ width: '100%', minHeight: '84px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45' }} />
      {vm.rcErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.rcErr}
        </div>
      ) : null}
    </div>
  );
}
