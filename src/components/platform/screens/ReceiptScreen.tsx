// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function ReceiptScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.aj?.on ? (
        <section aria-label="Auction journey" style={{ marginBottom: '16px', borderRadius: '18px', background: '#1F2A44', color: '#fff', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#F2C94C' }}>
              {"AUCTION JOURNEY · "}{vm.aj?.ref}
            </span>
            <span style={{ fontSize: '12px', color: '#CBD5E1' }}>
              {vm.aj?.note}
            </span>
          </div>
          <div className="hs" style={{ display: 'flex', overflowX: 'auto', marginTop: '12px', scrollbarWidth: 'none' }}>
            {list(vm.aj?.steps).map((t, index) => (
              <div key={index} style={{ flex: '1 0 84px', minWidth: '84px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '12px', left: 'calc(50% + 14px)', right: 'calc(-50% + 14px)', height: '2px', background: str(t?.line) }} />
                <span style={{ width: '26px', height: '26px', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', background: str(t?.dotBg), color: str(t?.dotFg), border: `2px solid ${t?.dotBd ?? ''}`, position: 'relative', zIndex: '1' }}>
                  <Val v={t?.n} />
                </span>
                <span style={{ fontSize: '11px', fontWeight: str(t?.fw), color: str(t?.fg), textAlign: 'center', lineHeight: '1.25' }}>
                  {t?.l}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <div style={{ padding: '16px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {vm.ov?.id}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>
          {vm.ov?.title}
        </div>
        <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>
          {vm.ov?.qtyLine}
        </div>
      </div>
      <div style={{ marginTop: '12px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13.5px' }}>
          <span style={{ color: '#5B6B82' }}>
            Expected quantity
          </span>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
            {vm.rcExpected}
          </span>
        </div>
      </div>
      <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '18px 4px 6px' }}>
        QUANTITY RECEIVED
      </label>
      <input aria-label="Quantity received" value={vm.rcQty ?? ''} onChange={vm.setRcQty} placeholder="e.g. 2 kg" style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px' }} />
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        CONDITION
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.rcConds).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        PHOTOS
      </div>
      <div onClick={vm.addRcPhoto} role="button" style={{ cursor: 'pointer', padding: '16px', borderRadius: '18px', border: '1.5px dashed #CBD5E1', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontWeight: '600' }}>
        <span>
          Add delivery photo
        </span>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: '#8A6508' }}>
          {vm.rcPhotos}{" added"}
        </span>
      </div>
      <div style={{ marginTop: '18px', padding: '12px 14px', borderRadius: '14px', background: '#F1F5F9', fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
        <b>
          Something wrong?
        </b>
        {" Raise a discrepancy if the quantity or condition does not match. Mineral Bridge will either send the missing quantity or refund the difference. For other money-back requests, use Request a refund on the order."}
      </div>
      <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '14px 4px 6px' }}>
        NOTE (NEEDED TO RAISE A DISCREPANCY)
      </label>
      <textarea aria-label="Delivery note" value={vm.rcNote ?? ''} onChange={vm.setRcNote} style={{ width: '100%', minHeight: '84px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45' }} />
      {vm.rcErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.rcErr}
        </div>
      ) : null}
    </div>
  );
}
