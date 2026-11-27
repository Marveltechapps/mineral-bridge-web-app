// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AppHeader({ vm }: { vm: ViewModel }) {
  return (
    <>
      <div style={{ background: 'linear-gradient(90deg,#0F172A,#1F2A44 55%,#2D3B5E)', color: '#fff', fontSize: '13px', fontWeight: '600', textAlign: 'center', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
        </svg>
        <span>
          Every lot inspected · Escrow-protected payments · Insured, tracked delivery
        </span>
        <button onClick={vm.goSell} style={{ background: '#F2C94C', color: '#1F2A44', border: 'none', fontFamily: 'inherit', fontWeight: '800', fontSize: '12px', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' }}>
          Sell a mineral
        </button>
      </div>
      {vm.web?.actBar ? (
        <button onClick={vm.web?.actBar?.tap} style={{ width: '100%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#F2C94C', color: '#1F2A44', padding: '8px 16px', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          {"Action needed · "}<Val v={vm.web?.actBar?.id} />{" · "}<Val v={vm.web?.actBar?.action} />{" →"}
        </button>
      ) : null}
      <header style={{ position: 'sticky', top: '0', zIndex: '40', background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '96px' }}>
          <button onClick={vm.web?.goHome} aria-label="Mineral Bridge home" style={{ display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'none', padding: '0', flexShrink: '0', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44' }}>
            <img src="/assets/m4/mb-logo.png" alt="" style={{ width: '80px', height: '80px', borderRadius: '40px', objectFit: 'cover', display: 'block' }} />
            <span className="hide-sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.1' }}>
              <span style={{ fontWeight: '800', fontSize: '21px', letterSpacing: '-.4px' }}>
                Mineral Bridge
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#8A6508', letterSpacing: '.8px' }}>
                VERIFIED TRADING
              </span>
            </span>
          </button>
          <button className="hide-sm navBtn" onClick={vm.web?.goTrading} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '10px', border: 'none', background: 'none', flexShrink: '0', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44' }}>
            <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#8A6508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', color: '#5B6B82', fontWeight: '600' }}>
                Trading from
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '200px' }}>
                <span style={{ minWidth: '0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {vm.web?.country}
                </span>
                <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 7px', borderRadius: '20px', flexShrink: '0', background: str(vm.web?.kycBg), color: str(vm.web?.kycFg) }}>
                  {vm.web?.kycShort}
                </span>
              </span>
            </span>
          </button>
          <div style={{ flex: '1', position: 'relative', minWidth: '120px' }}>
            <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5B6B82" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input aria-label="Search minerals and lots" value={vm.search ?? ''} onChange={vm.web?.onSearch} placeholder="Search gold, copper, lithium, lot ID…" style={{ width: '100%', height: '46px', border: '1.5px solid #E2E8F0', borderRadius: '13px', padding: '0 16px 0 42px', fontSize: '14px', fontWeight: '500', background: '#F8FAFC' }} />
          </div>
          {list(vm.web?.hnav).map((n, index) => (
            <button key={index} className="hide-sm navBtn" onClick={n?.tap} aria-current={n?.cur} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', border: 'none', background: 'none', padding: '6px 8px', borderRadius: '10px', fontFamily: 'inherit', fontSize: '11px', fontWeight: '700', cursor: 'pointer', color: str(n?.fg) }}>
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d={n?.icon} />
              </svg>
              <Val v={n?.label} />
              {n?.badge ? (
                <span style={{ position: 'absolute', top: '0', right: '2px', minWidth: '16px', height: '16px', borderRadius: '10px', background: '#B42318', color: '#fff', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                  <Val v={n?.badge} />
                </span>
              ) : null}
            </button>
          ))}
          <button className="navBtn" onClick={vm.web?.goAccount} aria-label="My account" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px', border: 'none', background: 'none', borderRadius: '10px', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44' }}>
            <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800' }}>
              <Val v={vm.pIni} />
            </span>
            <span className="hide-sm" style={{ fontSize: '13.5px', fontWeight: '700' }}>
              {vm.web?.acctLabel}
            </span>
          </button>
          <button className="authBtn" onClick={vm.goCart} aria-label="Cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', background: '#1F2A44', color: '#fff', height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', fontFamily: 'inherit', fontWeight: '700', fontSize: '14px', cursor: 'pointer', flexShrink: '0' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="hide-sm">
              Cart
            </span>
            {vm.cartCount ? (
              <span style={{ background: '#F2C94C', color: '#1F2A44', borderRadius: '20px', minWidth: '20px', height: '20px', padding: '0 6px', fontSize: '12px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Val v={vm.cartCount} />
              </span>
            ) : null}
          </button>
        </div>
        <nav className="wrap navScroll show-sm" aria-label="Categories" style={{ gap: '12px', paddingTop: '10px', paddingBottom: '10px', alignItems: 'stretch', overflowX: 'auto', borderTop: '1px solid #E2E8F0' }}>
          {list(vm.web?.mnav).map((c, index) => (
            <button key={index} onClick={c?.tap} style={{ width: '64px', flexShrink: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', border: 'none', background: 'none', padding: '0', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ width: '52px', height: '52px', borderRadius: '14px', border: `1.5px solid ${c?.bd ?? ''}`, backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(c?.img) }} />
              <span style={{ maxWidth: '64px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '11px', fontWeight: '700', color: str(c?.fg) }}>
                {c?.name}
              </span>
            </button>
          ))}
        </nav>
      </header>
    </>
  );
}
