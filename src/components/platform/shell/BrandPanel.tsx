// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';

export function BrandPanel({ vm }: { vm: ViewModel }) {
  return (
    <div className="onbBrand">
      <div aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundImage: 'url("/assets/m4/hero-grain.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(165deg,rgba(31,42,68,.93) 0%,rgba(31,42,68,.86) 52%,rgba(15,23,42,.97) 100%)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: '#F2C94C', top: '-110px', right: '-100px', animation: 'glowPulse 7s ease-in-out infinite' }} />
      <div aria-hidden="true" style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: '#F2C94C', bottom: '-80px', left: '-70px', animation: 'glowPulse 9s ease-in-out infinite 1.5s' }} />
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src="/assets/m4/mb-logo.png" alt="Mineral Bridge" style={{ width: '64px', height: '64px', borderRadius: '32px', objectFit: 'cover', display: 'block', boxShadow: '0 8px 22px -8px rgba(0,0,0,.6)', animation: 'floatY 6s ease-in-out infinite' }} />
        <span style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-.3px' }}>
          Mineral Bridge
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.4px', color: '#F2C94C' }}>
          VERIFIED MINERAL TRADING
        </div>
        <div style={{ fontWeight: '800', fontSize: '36px', lineHeight: '1.06', letterSpacing: '-1px', marginTop: '12px' }}>
          Buy and sell minerals, verified at every step.
        </div>
        <p style={{ margin: '14px 0 24px', fontSize: '15px', lineHeight: '1.6', color: '#CBD5E1', maxWidth: '360px' }}>
          Inspected lots, agreed quotations, e-contracts and tracked delivery for buyers and sellers worldwide.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          {list(vm.web?.perks).map((p, index) => (
            <div key={index} className="authF" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span aria-hidden="true" style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(242,201,76,.16)', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={p?.icon} />
                </svg>
              </span>
              <span>
                <span style={{ display: 'block', fontWeight: '700', fontSize: '13.5px' }}>
                  {p?.title}
                </span>
                <span style={{ display: 'block', fontSize: '12px', color: '#CBD5E1', marginTop: '1px' }}>
                  {p?.sub}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: '#CBD5E1' }}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '22px', color: '#fff' }}>
              {vm.web?.lotTotal}
            </div>
            verified lots
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '22px', color: '#fff' }}>
              5
            </div>
            mineral categories
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '22px', color: '#fff' }}>
              100%
            </div>
            KYC-checked traders
          </div>
        </div>
        {vm.devTools ? (
          <button onClick={vm.web?.toggleRail} style={{ height: '34px', padding: '0 12px', border: '1px solid rgba(242,201,76,.45)', borderRadius: '10px', background: 'transparent', color: '#F2C94C', fontFamily: 'inherit', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}>
            {vm.web?.railLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
