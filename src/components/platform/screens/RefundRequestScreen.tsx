// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function RefundRequestScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '16px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {vm.ov?.id}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>
          {vm.ov?.title}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <span style={{ fontSize: '12.5px', color: '#CBD5E1' }}>
            {"Paid · "}{vm.rfPaidVia}
          </span>
          <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '18px', color: '#F2C94C' }}>
            {vm.rfPaid}
          </span>
        </div>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        REASON
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.rfReasons).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '18px 4px 6px' }}>
        TELL US WHAT HAPPENED
      </label>
      <textarea aria-label="Refund details" value={vm.rfNote ?? ''} onChange={vm.setRfNote} placeholder="At least 10 characters" style={{ width: '100%', minHeight: '84px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45' }} />
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        REFUND AMOUNT
      </div>
      <div style={{ display: 'flex', gap: '3px', padding: '4px', borderRadius: '14px', background: '#E2E8F0' }}>
        {list(vm.rfTypes).map((t, index) => (
          <div key={index} onClick={t?.tap} role="radio" style={{ cursor: 'pointer', flex: '1', height: '38px', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(t?.bg), color: str(t?.fg) }}>
            <Val v={t?.label} />
          </div>
        ))}
      </div>
      {vm.rfPartial ? (
        <>
          <div style={{ position: 'relative', marginTop: '10px' }}>
            <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: '#5B6B82' }}>
              $
            </span>
            <input aria-label="Refund amount" inputMode="decimal" value={vm.rfAmt ?? ''} onChange={vm.setRfAmt} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px', paddingLeft: '28px', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#5B6B82', margin: '6px 4px 0' }}>
            The order continues; only this amount is returned.
          </div>
        </>
      ) : null}
      {vm.rfFull ? (
        <div style={{ fontSize: '12px', color: '#5B6B82', margin: '8px 4px 0' }}>
          A full refund cancels the order. Any shipment in progress is returned to Mineral Bridge.
        </div>
      ) : null}
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        REFUND TO
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list(vm.rfDest).map((o, index) => (
          <div key={index} className="mb-press-3" onClick={o?.tap} role="radio" style={{ transition: 'transform .12s, border-color .2s, box-shadow .2s', cursor: 'pointer', padding: '13px 15px', borderRadius: '18px', background: '#fff', display: 'flex', gap: '12px', alignItems: 'center', border: `1.5px solid ${o?.border ?? ''}`, boxShadow: str(o?.shadow) }}>
            <span style={{ width: '38px', height: '38px', flex: 'none', borderRadius: '12px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1F2A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={o?.icon} />
              </svg>
            </span>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {o?.name}
              </div>
              <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.4' }}>
                {o?.sub}
              </div>
            </div>
            <div style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '11px', transition: 'border .2s', border: str(o?.radio) }} />
          </div>
        ))}
      </div>
      {vm.rfHasFields ? (
        <div style={{ marginTop: '10px', padding: '14px', borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '0 2px 10px' }}>
            {vm.rfFieldsTitle}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {list(vm.rfAcct).map((f, index) => (
              <div key={index}>
                <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '0 4px 5px' }}>
                  {f?.l}
                </label>
                <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} placeholder={f?.ph} inputMode={f?.mode} style={{ width: '100%', height: '50px', borderRadius: '14px', background: '#F7F6F2', border: `1px solid ${f?.border ?? ''}`, padding: '0 14px', fontSize: '14.5px', fontFamily: str(f?.ff) }} />
                {f?.err ? (
                  <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                    {f?.err}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
            {vm.rfFieldsNote}
          </div>
        </div>
      ) : null}
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        EVIDENCE (OPTIONAL)
      </div>
      <div onClick={vm.addRfPhoto} role="button" style={{ cursor: 'pointer', padding: '15px', borderRadius: '16px', border: '1.5px dashed #CBD5E1', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13.5px', fontWeight: '600' }}>
        <span>
          Add photo or document
        </span>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', color: '#8A6508' }}>
          {vm.rfFiles}{" added"}
        </span>
      </div>
      <div onClick={vm.toggleRfAgree} role="checkbox" style={{ cursor: 'pointer', marginTop: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0' }}>
        <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.rfAgreeBg) }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span style={{ fontSize: '13px', lineHeight: '1.45' }}>
          I understand the order is paused while Mineral Bridge reviews this request, and refunds take 3–7 working days after approval.
        </span>
      </div>
      {vm.rfErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.rfErr}
        </div>
      ) : null}
    </div>
  );
}
