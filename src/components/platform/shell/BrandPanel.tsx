// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */
import type { ViewModel } from '../../../types/platform';

export function BrandPanel({ vm }: { vm: ViewModel }) {
  return (
    <div className="w4-brand" style={{ position: 'sticky', top: '0', height: '100vh', flex: '1 1 50%', minWidth: '0', background: '#121214', backgroundImage: "linear-gradient(180deg,rgba(18,18,20,.2),rgba(18,18,20,.88)), url('/assets/m4/hero-grain.png')", backgroundSize: 'cover', backgroundPosition: 'center', color: '#F4F2ED', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 48px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/assets/m4/mb-logo.png" alt="Mineral Bridge" style={{ width: '42px', height: '42px', borderRadius: '21px', objectFit: 'cover' }} />
        <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '26px' }}>
          Mineral Bridge
        </span>
      </div>
      <div style={{ maxWidth: '520px' }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', letterSpacing: '.9px', color: '#D9B456' }}>
          VERIFIED MINERAL TRADING
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '54px', lineHeight: '1', letterSpacing: '-.8px', marginTop: '14px' }}>
          Buy and sell minerals, verified at every step.
        </div>
        <div style={{ fontSize: '15px', color: 'rgba(244,242,237,.72)', lineHeight: '1.6', marginTop: '16px' }}>
          Inspected lots, agreed quotations, e-contracts and tracked delivery for buyers and sellers worldwide.
        </div>
        {vm.devTools ? (
          <button onClick={vm.web?.toggleRail} style={{ marginTop: '26px', height: '36px', padding: '0 14px', border: '1px solid rgba(244,242,237,.25)', borderRadius: '10px', background: 'transparent', color: '#D9B456', fontFamily: "'Geist Mono', monospace", fontSize: '11px', letterSpacing: '.6px', cursor: 'pointer' }}>
            {vm.web?.railLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
