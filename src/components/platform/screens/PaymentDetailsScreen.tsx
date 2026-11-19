// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function PaymentDetailsScreen({ vm }: { vm: ViewModel }) {
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
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        PAYMENT METHOD
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.payMethods).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        PAYMENT TERMS
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.payTerms).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        BILLING
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {list(vm.pfBill).map((f, index) => (
          <div key={index}>
            <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '0 4px 5px' }}>
              {f?.l}
            </label>
            <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', borderColor: str(f?.border) }} />
            {f?.err ? (
              <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                {f?.err}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '10px 4px 5px' }}>
        PAYMENT INSTRUCTIONS (OPTIONAL)
      </label>
      <textarea aria-label="Payment instructions" value={vm.pfInstr ?? ''} onChange={vm.setPfInstr} style={{ width: '100%', minHeight: '84px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45' }} />
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        CONFIRMATION
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div onClick={vm.togglePfC1} role="checkbox" style={{ cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #121214', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.pfC1Bg) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
            The payment details above are correct.
          </span>
        </div>
      </div>
      {vm.pfErrList ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.pfErrList}
        </div>
      ) : null}
    </div>
  );
}
