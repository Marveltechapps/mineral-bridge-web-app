// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function KycStatusScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {vm.kycStatusRef}
        </div>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '23.0px', marginTop: '6px' }}>
          {vm.kycStatusWord}
        </div>
        <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '4px' }}>
          {"Submitted "}{vm.kycSubmitted}
        </div>
      </div>
      {vm.kycIsRejected ? (
        <>
          <div role="alert" style={{ marginTop: '12px', padding: '13px 15px', borderRadius: '16px', background: '#FDECEA', color: '#B42318', fontSize: '13px', lineHeight: '1.5' }}>
            <b>
              Action needed.
            </b>
            {' '}{vm.kycReason}
          </div>
          <div onClick={vm.goKycFix} style={{ cursor: 'pointer', marginTop: '8px', height: '50px', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
            Upload a new document
          </div>
        </>
      ) : null}
      {vm.kycIsNone ? (
        <div style={{ marginTop: '12px', padding: '13px 15px', borderRadius: '16px', background: '#FEF7E0', color: '#6B4E05', fontSize: '13px', lineHeight: '1.5' }}>
          You can browse now. Verification is needed before you buy or sell.
        </div>
      ) : null}
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        DOCUMENTS
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
        {list(vm.kycList).map((d, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ color: '#5B6B82' }}>
                {d?.n}
              </div>
              <div style={{ fontWeight: '600', marginTop: '2px', color: str(d?.fg) }}>
                {d?.v}
              </div>
              {d?.flag ? (
                <div style={{ fontSize: '12px', color: '#B42318', marginTop: '3px', lineHeight: '1.4' }}>
                  {d?.flag}
                </div>
              ) : null}
            </div>
            {d?.canEdit ? (
              <div onClick={d?.tap} role="button" style={{ cursor: 'pointer', flex: 'none', height: '34px', padding: '0 13px', borderRadius: '11px', display: 'flex', alignItems: 'center', fontSize: '12.5px', fontWeight: '600', background: str(d?.btnBg), color: str(d?.btnFg), border: `1px solid ${d?.btnBorder ?? ''}` }}>
                <Val v={d?.btn} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {vm.devTools && vm.kycIsPending ? (
        <div style={{ marginTop: '14px', padding: '14px', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
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
