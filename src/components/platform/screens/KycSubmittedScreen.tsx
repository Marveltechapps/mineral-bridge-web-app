// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';

export function KycSubmittedScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both', paddingTop: '40px', textAlign: 'center' }}>
      <div style={{ width: '84px', height: '84px', margin: '0 auto', borderRadius: '42px', background: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .5s both' }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 7v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20" />
        </svg>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.3px', fontSize: '26.2px', lineHeight: '1.05', marginTop: '22px' }}>
        KYC submitted for review
      </div>
      <div style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        {"Most reviews finish within one working day. "}{vm.kycReturnNote}
      </div>
      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginTop: '16px', padding: '9px 16px', borderRadius: '99px', background: '#fff', border: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
          REF
        </span>
        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '600', fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
          {vm.kycRef}
        </span>
      </div>
      {vm.devTools ? (
        <div style={{ marginTop: '22px', padding: '14px', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'left' }}>
          <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
            DEMO · SIMULATE COMPLIANCE DECISION
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <div onClick={vm.simApproveKyc} style={{ cursor: 'pointer', flex: '1', height: '42px', borderRadius: '12px', background: '#E2F2E9', color: '#17704C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
              Approve
            </div>
            <div onClick={vm.simRejectKyc} style={{ cursor: 'pointer', flex: '1', height: '42px', borderRadius: '12px', background: '#FDECEA', color: '#B42318', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
              Ask for document
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
