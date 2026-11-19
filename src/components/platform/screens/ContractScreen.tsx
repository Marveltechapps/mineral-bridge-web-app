// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function ContractScreen({ vm }: { vm: ViewModel }) {
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
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '4px 16px', marginTop: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '10px', padding: '12px 0', borderBottom: '1px solid #EFEDE7' }}>
          <div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
              BUYER
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
              {vm.partyBuyer}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '9.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
              SELLER
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '4px' }}>
              {vm.partySeller}
            </div>
          </div>
        </div>
        {list(vm.clauses).map((c, index) => (
          <div key={index} style={{ padding: '11px 0', borderBottom: '1px solid #EFEDE7' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#8A6A1C' }}>
              {c?.k}
            </div>
            <div style={{ fontSize: '13px', marginTop: '3px', lineHeight: '1.45' }}>
              {c?.v}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '10px', padding: '12px 0', fontSize: '12.5px' }}>
          <span style={{ flex: '1' }}>
            {"You: "}
            <b>
              {vm.youSignedLabel}
            </b>
          </span>
          <span style={{ flex: '1' }}>
            {"Mineral Bridge: "}
            <b>
              {vm.mbSignedLabel}
            </b>
          </span>
        </div>
      </div>
      <div style={{ marginTop: '12px' }}>
        <div onClick={vm.toggleRead} role="checkbox" style={{ cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '16px', background: '#fff', border: '1px solid #E4E2DB' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #121214', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.signReadBg) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
            I have read and agree to this e-contract.
          </span>
        </div>
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '16px 4px 6px' }}>
        {"TYPE YOUR FULL NAME TO SIGN · "}{vm.signAs}
      </label>
      <input aria-label="Signature" value={vm.signName ?? ''} onChange={vm.setSignName} placeholder={vm.signAs} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '22px', fontFamily: "'Instrument Serif', serif" }} />
      {vm.signErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.signErr}
        </div>
      ) : null}
    </div>
  );
}
