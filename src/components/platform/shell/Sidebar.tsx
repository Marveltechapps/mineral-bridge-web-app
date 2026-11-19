// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */
import type { ViewModel } from '../../../types/platform';
import { css, list } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function Sidebar({ vm }: { vm: ViewModel }) {
  return (
    <aside className={`w4-side ${vm.web?.sideCls ?? ''}`} style={{ position: 'sticky', top: '0', height: '100vh', width: '252px', flex: 'none', background: '#121214', color: '#F4F2ED', display: 'flex', flexDirection: 'column', transition: 'width .2s' }}>
      <div className="w5-logo" style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '24px 22px 18px' }}>
        <img src="/assets/m4/mb-logo.png" alt="Mineral Bridge" style={{ width: '38px', height: '38px', borderRadius: '19px', objectFit: 'cover' }} />
        <div className="w5-txt" style={{ flex: '1', fontFamily: "'Instrument Serif', serif", fontSize: '23px', lineHeight: '1' }}>
          Mineral Bridge
        </div>
      </div>
      <div style={{ padding: '0 12px 4px' }}>
        <button onClick={vm.web?.toggleNav} aria-label={vm.web?.navLabel} title={vm.web?.navLabel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', height: '34px', border: '1px solid rgba(244,242,237,.12)', borderRadius: '10px', background: 'transparent', color: '#B9B7BD', fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={vm.web?.navIcon} />
          </svg>
          <span className="w5-txt">
            Collapse menu
          </span>
        </button>
      </div>
      <nav className="w4-nav" style={{ padding: '6px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {list(vm.web?.nav).map((n, index) => (
          <button key={index} className={n?.cls} onClick={n?.tap} title={n?.label} style={css(n?.style)}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={n?.icon} />
            </svg>
            <span>
              {n?.label}
            </span>
          </button>
        ))}
        <div style={{ height: '1px', background: 'rgba(244,242,237,.1)', margin: '10px 6px' }} />
        <button onClick={vm.web?.goAuctions} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', height: '44px', padding: '0 14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', textAlign: 'left', background: 'transparent', color: '#B9B7BD' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 13l-7.5 7.5a2.1 2.1 0 0 1-3-3L11 10M16 16l6-6M8 8l6-6M9 7l8 8" />
          </svg>
          <span style={{ flex: '1' }}>
            Auctions
          </span>
        </button>
        <button onClick={vm.goCart} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', height: '44px', padding: '0 14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', textAlign: 'left', background: 'transparent', color: '#B9B7BD' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span style={{ flex: '1' }}>
            Cart
          </span>
          {vm.cartCount ? (
            <span style={{ minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '10px', background: '#D9B456', color: '#121214', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Val v={vm.cartCount} />
            </span>
          ) : null}
        </button>
        <button onClick={vm.goNotifs} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', height: '44px', padding: '0 14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', textAlign: 'left', background: 'transparent', color: '#B9B7BD' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span style={{ flex: '1' }}>
            Notifications
          </span>
          {vm.unread ? (
            <span style={{ minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '10px', background: '#C2412D', color: '#fff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Val v={vm.unread} />
            </span>
          ) : null}
        </button>
        <button onClick={vm.web?.goHelp} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', height: '44px', padding: '0 14px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', textAlign: 'left', background: 'transparent', color: '#B9B7BD' }}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" />
          </svg>
          <span style={{ flex: '1' }}>
            {"Help & support"}
          </span>
        </button>
      </nav>
      <div style={{ flex: '1' }} />
      <div className="w5-foot" style={{ padding: '12px 16px 20px', borderTop: '1px solid rgba(244,242,237,.08)' }}>
        {vm.devTools ? (
          <>
            <button onClick={vm.web?.toggleRail} style={{ width: '100%', height: '38px', border: '1px solid rgba(244,242,237,.16)', borderRadius: '10px', background: 'transparent', color: '#D9B456', fontFamily: "'Geist Mono', monospace", fontSize: '11px', letterSpacing: '.6px', cursor: 'pointer' }}>
              {vm.web?.railLabel}
            </button>
            {' '}
            <button onClick={vm.resetDemo} style={{ width: '100%', height: '32px', marginTop: '6px', border: 'none', background: 'transparent', color: '#8B8A90', fontFamily: 'inherit', fontSize: '12px', cursor: 'pointer' }}>
              Reset demo data
            </button>
          </>
        ) : null}
      </div>
    </aside>
  );
}
