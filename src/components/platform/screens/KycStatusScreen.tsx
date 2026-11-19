// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function KycStatusScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ padding: '18px', borderRadius: '22px', background: '#121214', color: '#F4F2ED' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#9C9AA0' }}>
          {vm.kycStatusRef}
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', marginTop: '6px' }}>
          {vm.kycStatusWord}
        </div>
        <div style={{ fontSize: '12.5px', color: '#C9C7C0', marginTop: '4px' }}>
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
          <div onClick={vm.goKycFix} style={{ cursor: 'pointer', marginTop: '8px', height: '50px', borderRadius: '16px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
            Upload a new document
          </div>
        </>
      ) : null}
      {vm.kycIsNone ? (
        <div style={{ marginTop: '12px', padding: '13px 15px', borderRadius: '16px', background: '#FBF3E4', color: '#7A4A08', fontSize: '13px', lineHeight: '1.5' }}>
          You can browse now. Verification is needed before you buy or sell.
        </div>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '20px 4px 8px' }}>
        DOCUMENTS
      </div>
      <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
        {list(vm.kycList).map((d, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', borderBottom: '1px solid #EFEDE7', fontSize: '13.5px' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ color: '#6B6A70' }}>
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
        <div style={{ marginTop: '14px', padding: '14px', borderRadius: '16px', border: '1px dashed #D5D3CC' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
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
