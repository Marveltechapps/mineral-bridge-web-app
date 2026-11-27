// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function SummaryAside({ vm }: { vm: ViewModel }) {
  return (
    <aside className="w5-aside" style={{ position: 'sticky', top: '100px', width: '340px', flex: 'none', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '28px', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '20px' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
          {vm.web?.sumH}
        </div>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '20.5px', lineHeight: '1.1', marginTop: '8px', textWrap: 'pretty' }}>
          {vm.web?.sumTitle}
        </div>
        {vm.web?.sumSub ? (
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '11.5px', color: '#5B6B82', marginTop: '6px' }}>
            {vm.web?.sumSub}
          </div>
        ) : null}
        {vm.web?.hasSum ? (
          <div style={{ marginTop: '14px', borderTop: '1px solid #F1F5F9' }}>
            {list(vm.web?.sum).map((r, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
                <span style={{ color: '#5B6B82', flex: 'none' }}>
                  {r?.k}
                </span>
                <span style={{ fontWeight: '600', textAlign: 'right', minWidth: '0' }}>
                  {r?.v}
                </span>
              </div>
            ))}
          </div>
        ) : null}
        {vm.m?.cta ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
            <button className="mb-press-1" onClick={vm.primary} style={{ whiteSpace: 'nowrap', transition: 'transform .12s, opacity .2s', width: '100%', height: '52px', padding: '0 20px', border: 'none', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', fontFamily: 'inherit', fontSize: '15px', fontWeight: '600', cursor: 'pointer', opacity: str(vm.m?.ctaOpacity) }}>
              {vm.m?.cta}
            </button>
            {vm.m?.cta2 ? (
              <button onClick={vm.secondary} style={{ whiteSpace: 'nowrap', width: '100%', height: '48px', padding: '0 20px', border: '1px solid #E2E8F0', borderRadius: '16px', background: '#fff', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: '600', cursor: 'pointer', color: str(vm.m?.cta2Fg) }}>
                {vm.m?.cta2}
              </button>
            ) : null}
          </div>
        ) : null}
        {vm.web?.sumNote ? (
          <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '14px', lineHeight: '1.5', textWrap: 'pretty' }}>
            {vm.web?.sumNote}
          </div>
        ) : null}
      </div>
      <div onClick={vm.web?.goHelp} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '14px 16px', background: 'transparent' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
        <div style={{ flex: '1', fontSize: '13px' }}>
          <div style={{ fontWeight: '600' }}>
            Need help with this step?
          </div>
          <div style={{ color: '#5B6B82', marginTop: '2px' }}>
            Phone, WhatsApp, email or chat
          </div>
        </div>
      </div>
    </aside>
  );
}
