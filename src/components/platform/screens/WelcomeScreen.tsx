// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';

export function WelcomeScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '0 22px 26px', animation: 'fadeIn .5s both' }}>
      <div className="w4-wel-hero" style={{ height: '330px', margin: '4px -8px 0', borderRadius: '30px', backgroundImage: 'url("/assets/m4/hero-grain.png")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(15,23,42,0) 40%,rgba(15,23,42,.75))' }} />
        <div style={{ position: 'absolute', left: '20px', bottom: '18px', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#F2C94C' }}>
          VERIFIED MINERAL TRADING
        </div>
      </div>
      <div className="w4-wel-hero" style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.6px', fontSize: '36.1px', lineHeight: '1', marginTop: '24px' }}>
        Buy and sell minerals, verified at every step.
      </div>
      <div className="w4-wel-hero" style={{ fontSize: '14px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
        Inspected lots, agreed quotations, e-contracts and tracked delivery for buyers and sellers worldwide.
      </div>
      <div className="w4-wel-desk" style={{ display: 'none' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '800', letterSpacing: '-.5px', fontSize: '32.8px', lineHeight: '1.05', marginTop: '12vh' }}>
          Welcome to Mineral Bridge
        </div>
        <div style={{ fontSize: '14.5px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.55' }}>
          Create an account to buy or sell, sign in to continue, or look around first.
        </div>
      </div>
      <div style={{ flex: '1' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
        <div className="mb-press-1" onClick={vm.startSignup} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', height: '56px', borderRadius: '18px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600' }}>
          Create account
        </div>
        <div className="mb-press-1" onClick={vm.startSignin} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', height: '56px', borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600' }}>
          Sign in
        </div>
        <div onClick={vm.browseGuest} role="button" style={{ cursor: 'pointer', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#5B6B82' }}>
          Browse as guest
        </div>
      </div>
    </div>
  );
}
