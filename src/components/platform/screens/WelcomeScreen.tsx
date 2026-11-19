// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';

export function WelcomeScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '0 22px 26px', animation: 'fadeIn .5s both' }}>
      <div className="w4-wel-hero" style={{ height: '330px', margin: '4px -8px 0', borderRadius: '30px', backgroundImage: 'url("/assets/m4/hero-grain.png")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(18,18,20,0) 40%,rgba(18,18,20,.75))' }} />
        <div style={{ position: 'absolute', left: '20px', bottom: '18px', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#D9B456' }}>
          VERIFIED MINERAL TRADING
        </div>
      </div>
      <div className="w4-wel-hero" style={{ fontFamily: "'Instrument Serif', serif", fontSize: '44px', lineHeight: '1', letterSpacing: '-.6px', marginTop: '24px' }}>
        Buy and sell minerals, verified at every step.
      </div>
      <div className="w4-wel-hero" style={{ fontSize: '14px', color: '#6B6A70', marginTop: '10px', lineHeight: '1.5' }}>
        Inspected lots, agreed quotations, e-contracts and tracked delivery for buyers and sellers worldwide.
      </div>
      <div className="w4-wel-desk" style={{ display: 'none' }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '40px', lineHeight: '1.05', marginTop: '12vh' }}>
          Welcome to Mineral Bridge
        </div>
        <div style={{ fontSize: '14.5px', color: '#6B6A70', marginTop: '10px', lineHeight: '1.55' }}>
          Create an account to buy or sell, sign in to continue, or look around first.
        </div>
      </div>
      <div style={{ flex: '1' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
        <div className="mb-press-1" onClick={vm.startSignup} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', height: '56px', borderRadius: '18px', background: '#121214', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600' }}>
          Create account
        </div>
        <div className="mb-press-1" onClick={vm.startSignin} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', height: '56px', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '600' }}>
          Sign in
        </div>
        <div onClick={vm.browseGuest} role="button" style={{ cursor: 'pointer', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#6B6A70' }}>
          Browse as guest
        </div>
      </div>
    </div>
  );
}
