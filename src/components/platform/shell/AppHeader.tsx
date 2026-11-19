// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AppHeader({ vm }: { vm: ViewModel }) {
  return (
    <header style={{ position: 'sticky', top: '0', zIndex: '20', background: 'rgba(244,242,237,.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E4E2DB' }}>
      <div style={{ height: '68px', display: 'flex', alignItems: 'center', gap: '14px', padding: '0 36px' }}>
        <div className="w4-mnav" style={{ display: 'none', alignItems: 'center', gap: '4px', overflowX: 'auto' }}>
          {list(vm.web?.nav).map((n, index) => (
            <button key={index} onClick={n?.tap} style={{ height: '36px', padding: '0 12px', border: 'none', borderRadius: '10px', background: 'transparent', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {n?.label}
            </button>
          ))}
        </div>
        {vm.web?.canBack ? (
          <button onClick={vm.back} aria-label="Back" style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#121214' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        <div style={{ flex: '1', minWidth: '0', fontFamily: "'Instrument Serif', serif", fontSize: '26px', lineHeight: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vm.web?.title}
        </div>
        <button onClick={vm.goNotifs} aria-label="Notifications" style={{ position: 'relative', width: '42px', height: '42px', flex: 'none', borderRadius: '21px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#121214' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {vm.unread ? (
            <span style={{ position: 'absolute', top: '-3px', right: '-3px', minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', background: '#C2412D', color: '#fff', fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Val v={vm.unread} />
            </span>
          ) : null}
        </button>
        <button onClick={vm.goCart} aria-label="Cart" style={{ position: 'relative', width: '42px', height: '42px', flex: 'none', borderRadius: '21px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#121214' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
          </svg>
          {vm.cartCount ? (
            <span style={{ position: 'absolute', top: '-3px', right: '-3px', minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', background: '#D9B456', color: '#121214', fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Val v={vm.cartCount} />
            </span>
          ) : null}
        </button>
      </div>
      {vm.web?.hasStep ? (
        <div style={{ padding: '0 36px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            <span>
              {vm.m?.step}
            </span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: '#E4E2DB', marginTop: '7px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#121214', borderRadius: '2px', transition: 'width .3s', width: str(vm.m?.prog) }} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
