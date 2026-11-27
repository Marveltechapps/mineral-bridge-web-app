// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function CancelScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '16px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {vm.ov?.id}{" · "}{vm.ov?.status}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>
          {vm.ov?.title}
        </div>
        <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>
          {vm.ov?.qtyLine}{" · "}{vm.ov?.value}
        </div>
      </div>
      <div style={{ marginTop: '12px', padding: '14px 15px', borderRadius: '16px', background: str(vm.cxBoxBg), border: `1px solid ${vm.cxBoxBorder ?? ''}` }}>
        <div style={{ fontSize: '13.5px', fontWeight: '600', color: str(vm.cxBoxFg) }}>
          {vm.cxHead}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
          {list(vm.cxPoints).map((pt, index) => (
            <div key={index} style={{ display: 'flex', gap: '9px', fontSize: '12.5px', color: '#334155', lineHeight: '1.45' }}>
              <span style={{ width: '5px', height: '5px', flex: 'none', borderRadius: '3px', background: '#5B6B82', marginTop: '7px' }} />
              <span>
                {pt?.t}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        WHY ARE YOU CANCELLING?
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.cxReasons).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '18px 4px 6px' }}>
        {vm.cxNoteLabel}
      </label>
      <textarea aria-label="Cancellation note" value={vm.cxNote ?? ''} onChange={vm.setCxNote} placeholder="Anything Mineral Bridge should know" style={{ width: '100%', minHeight: '76px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '12px 15px', fontSize: '14px', resize: 'none', lineHeight: '1.45' }} />
      <div onClick={vm.toggleCxAgree} role="checkbox" style={{ cursor: 'pointer', marginTop: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0' }}>
        <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.cxAgreeBg) }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
          {vm.cxAgreeText}
        </span>
      </div>
      {vm.cxErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.cxErr}
        </div>
      ) : null}
    </div>
  );
}
