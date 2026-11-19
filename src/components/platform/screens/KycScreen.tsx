// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function KycScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '32px', lineHeight: '1.05', letterSpacing: '-.3px' }}>
        Verify your identity
      </div>
      <div style={{ fontSize: '14px', color: '#6B6A70', marginTop: '10px', lineHeight: '1.5' }}>
        Every buyer and seller is verified before trading. Your documents are encrypted and only seen by our compliance team.
      </div>
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '22px 2px 8px' }}>
        ID TYPE
      </div>
      <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
        {list(vm.idTypes).map((c, index) => (
          <div key={index} onClick={c?.tap} style={{ cursor: 'pointer', padding: '9px 14px', borderRadius: '99px', border: '1px solid #E4E2DB', fontSize: '13px', fontWeight: '600', background: str(c?.bg), color: str(c?.fg) }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '22px 2px 8px' }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
          DOCUMENTS
        </span>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11.5px', fontWeight: '600', color: '#8A6A1C' }}>
          {vm.kycCount}
        </span>
      </div>
      <div style={{ height: '5px', borderRadius: '3px', background: '#E7E5DF', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg,#B8902F,#D9B456)', transition: 'width .5s cubic-bezier(.2,.8,.2,1)', width: str(vm.kycPct) }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {list(vm.kycDocs).map((d, index) => (
          <div key={index} className="mb-press-3" onClick={d?.tap} role="button" style={{ transition: 'transform .12s, border-color .2s', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '13px', padding: '10px 12px 10px 10px', borderRadius: '18px', background: '#fff', border: `1.5px solid ${d?.border ?? ''}` }}>
            <div style={{ width: '62px', height: '46px', flex: 'none', borderRadius: '10px', overflow: 'hidden', position: 'relative', background: '#F1EFE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {d?.hasImg ? (
                <div role="img" aria-label={d?.label} style={{ width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundImage: str(d?.bg) }} />
              ) : null}
              {d?.isPdf ? (
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10px', fontWeight: '700', color: '#B42318' }}>
                  PDF
                </span>
              ) : null}
              {d?.isSample ? (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1E2A20,#3F5A45)', display: 'flex', alignItems: 'center', gap: '4px', padding: '5px' }}>
                  <span style={{ width: '16px', height: '20px', borderRadius: '3px', background: '#C9C7C0' }} />
                  <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,.7)' }} />
                    <span style={{ height: '3px', width: '70%', borderRadius: '2px', background: 'rgba(255,255,255,.5)' }} />
                    <span style={{ height: '3px', width: '50%', borderRadius: '2px', background: 'rgba(255,255,255,.5)' }} />
                  </span>
                </div>
              ) : null}
              {d?.todo ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B8A90" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d?.icon} />
                </svg>
              ) : null}
            </div>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', lineHeight: '1.35', textWrap: 'pretty' }}>
                {d?.label}
              </div>
              <div style={{ fontSize: '12px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: str(d?.subFg) }}>
                {d?.sub}
              </div>
            </div>
            {d?.flagged ? (
              <span style={{ flex: 'none', padding: '4px 9px', borderRadius: '99px', background: '#B42318', color: '#fff', fontSize: '11.5px', fontWeight: '600' }}>
                Re-upload
              </span>
            ) : null}
            {d?.doneOk ? (
              <span style={{ width: '24px', height: '24px', flex: 'none', borderRadius: '12px', background: '#17704C', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .35s both' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            ) : null}
            {d?.todo ? (
              <span style={{ flex: 'none', fontSize: '12.5px', fontWeight: '600', color: '#8A6A1C' }}>
                Upload
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '14px' }}>
        <div onClick={vm.toggleConsent} role="checkbox" style={{ cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 15px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #121214', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.kycConsentBg) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
            I confirm these documents are genuine and consent to identity checks.
          </span>
        </div>
      </div>
      {vm.kycErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.kycErr}
        </div>
      ) : null}
    </div>
  );
}
