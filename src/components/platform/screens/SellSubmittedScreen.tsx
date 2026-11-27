// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function SellSubmittedScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both', paddingTop: '40px', textAlign: 'center' }}>
      <div role="list" aria-label="Sell request steps" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', padding: '10px 14px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0' }}>
        {list(vm.web?.sellPre).map((t, index) => (
          <span key={index} role="listitem" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: str(t?.fw), color: str(t?.fg) }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '11px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', background: str(t?.bg), color: str(t?.dot), border: `1.5px solid ${t?.bd ?? ''}` }}>
              <Val v={t?.n} />
            </span>
            <Val v={t?.l} />
            {t?.arrow ? (
              <span aria-hidden="true" style={{ color: '#94A3B8', marginLeft: '2px' }}>
                ›
              </span>
            ) : null}
          </span>
        ))}
        <span style={{ fontSize: '12px', color: '#5B6B82', marginLeft: 'auto' }}>
          Then: review · price · e-contract · inspection · payment · pickup
        </span>
      </div>
      <div style={{ width: '84px', height: '84px', margin: '0 auto', borderRadius: '42px', background: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .5s both' }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.3px', fontSize: '26.2px', lineHeight: '1.05', marginTop: '22px' }}>
        Sell request submitted
      </div>
      <div style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        {vm.sellSummary}. Nothing is sold until you accept a price and sign the e-contract.
      </div>
      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginTop: '16px', padding: '9px 16px', borderRadius: '99px', background: '#fff', border: '1px solid #E2E8F0' }}>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
          REF
        </span>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
          {vm.sellRef}
        </span>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '24px 4px 8px', textAlign: 'left' }}>
        WHAT HAPPENS NEXT
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 16px', textAlign: 'left' }}>
        {list(vm.sellNext).map((n, index) => (
          <div key={index} style={{ display: 'flex', gap: '12px', padding: '13px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Val v={n?.n} />
            </span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {n?.t}
              </div>
              <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '2px', lineHeight: '1.45' }}>
                {n?.b}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
