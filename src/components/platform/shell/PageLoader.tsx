// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */

/** Brand loader shown over the page while Home opens (no view values needed). */
export function PageLoader() {
  return (
    <div className="mbLoader" role="status" aria-live="polite" aria-label="Loading Mineral Bridge" style={{ position: 'fixed', inset: '0', zIndex: '150', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '28px', background: 'radial-gradient(90% 80% at 50% 45%, #2D3B5E 0%, #1F2A44 50%, #0F172A 100%)', animation: 'loaderFade 1.3s ease both' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundImage: 'radial-gradient(rgba(242,201,76,.14) 1px, transparent 1px)', backgroundSize: '22px 22px', opacity: '.5' }} />
      <div style={{ position: 'relative', width: '212px', height: '212px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '-40px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,201,76,.32), rgba(242,201,76,0) 66%)', animation: 'logoPulse 1.6s ease-in-out infinite' }} />
        <svg aria-hidden="true" width="212" height="212" viewBox="0 0 212 212" style={{ position: 'absolute', left: '0', top: '0', transformOrigin: '50% 50%', animation: 'ringSpin 1s linear infinite' }}>
          <circle cx="106" cy="106" r="100" fill="none" stroke="rgba(242,201,76,.2)" strokeWidth="5" />
          <circle cx="106" cy="106" r="100" fill="none" stroke="#F2C94C" strokeWidth="5" strokeLinecap="round" strokeDasharray="160 469" />
        </svg>
        <img src="/assets/m4/mb-logo.png" alt="Mineral Bridge" style={{ position: 'relative', width: '170px', height: '170px', borderRadius: '50%', objectFit: 'cover', display: 'block', boxShadow: '0 18px 40px -16px rgba(0,0,0,.7)', animation: 'logoPulse 1.6s ease-in-out infinite' }} />
      </div>
      <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-.3px' }}>
          Mineral Bridge
        </div>
        <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '6px' }}>
          Loading verified lots…
        </div>
      </div>
    </div>
  );
}
