// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { str } from '../../../lib/platform/view';

export function RegistrationDetailsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '32px', lineHeight: '1.05', letterSpacing: '-.3px' }}>
        {vm.regHeading}
      </div>
      <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '14px', background: '#E2F2E9', color: '#17704C', fontSize: '13px', fontWeight: '500' }}>
        {vm.regContact}
      </div>
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '18px 2px 8px' }}>
        {vm.regBizLabel}
      </label>
      <input aria-label="Business name" value={vm.regBusiness ?? ''} onChange={vm.setRegBusiness} placeholder={vm.regBizPh} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px' }} />
      <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '18px 2px 8px' }}>
        COUNTRY
      </label>
      <input aria-label="Country" value={vm.regCountry ?? ''} onChange={vm.setRegCountry} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px' }} />
      <div style={{ marginTop: '16px' }}>
        <div onClick={vm.toggleTerms} role="checkbox" style={{ cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '14px 15px', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #121214', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.regTermsBg) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
            I accept the Mineral Bridge terms of use and privacy policy.
          </span>
        </div>
      </div>
      {vm.regErr ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.regErr}
        </div>
      ) : null}
    </div>
  );
}
