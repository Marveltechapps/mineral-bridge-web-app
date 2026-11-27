// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AccountNav({ vm }: { vm: ViewModel }) {
  return (
    <aside className="acctNav" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', position: 'sticky', top: '116px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 8px 16px', borderBottom: '1px solid #E2E8F0', marginBottom: '12px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '800', flexShrink: '0' }}>
          <Val v={vm.pIni} />
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{ fontWeight: '800', fontSize: '14.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {vm.pName}
          </div>
          <div style={{ fontSize: '12px', color: '#5B6B82', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {vm.pBiz}
          </div>
        </div>
      </div>
      <nav aria-label="Account" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {list(vm.web?.acctNav).map((n, index) => (
          <button key={index} onClick={n?.tap} aria-current={n?.cur} style={{ display: 'flex', alignItems: 'center', gap: '11px', width: '100%', padding: '11px 12px', borderRadius: '11px', border: 'none', fontFamily: 'inherit', fontWeight: '700', fontSize: '13.5px', textAlign: 'left', cursor: 'pointer', background: str(n?.bg), color: str(n?.fg), boxShadow: str(n?.sh) }}>
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d={n?.icon} />
            </svg>
            <span style={{ flex: '1' }}>
              {n?.label}
            </span>
            {n?.badge ? (
              <span style={{ minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '10px', background: str(n?.badgeBg), color: '#fff', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Val v={n?.badge} />
              </span>
            ) : null}
          </button>
        ))}
      </nav>
      {vm.signedIn ? (
        <button onClick={vm.logout} style={{ display: 'flex', alignItems: 'center', gap: '11px', width: '100%', padding: '14px 12px 10px', marginTop: '8px', border: 'none', borderTop: '1px solid #E2E8F0', background: 'none', fontFamily: 'inherit', fontWeight: '700', fontSize: '13.5px', color: '#B42318', textAlign: 'left', cursor: 'pointer' }}>
          <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Log out
        </button>
      ) : null}
      {vm.guest ? (
        <button onClick={vm.startSignin} style={{ width: '100%', marginTop: '12px', height: '44px', borderRadius: '12px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
          Sign in
        </button>
      ) : null}
    </aside>
  );
}
