// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';

export function OrderPlacedScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both', paddingTop: '44px', textAlign: 'center' }}>
      <div style={{ width: '84px', height: '84px', margin: '0 auto', borderRadius: '42px', background: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .5s both' }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.3px', fontSize: '26.2px', lineHeight: '1.05', marginTop: '22px' }}>
        Order placed
      </div>
      <div style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        Mineral Bridge Operations will review your order and send a quotation. No payment has been taken.
      </div>
      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginTop: '16px', padding: '9px 16px', borderRadius: '99px', background: '#fff', border: '1px solid #E2E8F0' }}>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
          ORDER
        </span>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
          {vm.placedOrder}
        </span>
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '4px 16px', marginTop: '22px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            1
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Order review and acceptance
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            2
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            Quotation for you to accept
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 0' }}>
          <span style={{ width: '26px', height: '26px', flex: 'none', borderRadius: '13px', background: '#1F2A44', color: '#F2C94C', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            3
          </span>
          <span style={{ fontSize: '13.5px', fontWeight: '500' }}>
            E-contract signed by both sides
          </span>
        </div>
      </div>
      <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '12px' }}>
        You will be notified by email, SMS and WhatsApp at each step.
      </div>
    </div>
  );
}
