// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AuthScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0' }}>
      <div style={{ position: 'relative', height: '196px', borderRadius: '28px', overflow: 'hidden', background: '#121214', animation: 'rise .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ position: 'absolute', inset: '0', backgroundImage: 'url("/assets/m4/hero-grain.png")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: '.42' }} />
        <div style={{ position: 'absolute', width: '220px', height: '220px', borderRadius: '110px', left: '-60px', top: '-80px', background: 'radial-gradient(circle, rgba(217,180,86,.55), rgba(217,180,86,0) 70%)', animation: 'drift1 9s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '90px', right: '-50px', bottom: '-70px', background: 'radial-gradient(circle, rgba(244,242,237,.22), rgba(244,242,237,0) 70%)', animation: 'drift2 11s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', right: '22px', top: '22px', width: '64px', height: '64px', borderRadius: '32px', border: '1px dashed rgba(217,180,86,.55)', animation: 'spinSlow 24s linear infinite' }} />
        <div style={{ position: 'absolute', right: '38px', top: '38px', width: '32px', height: '32px', borderRadius: '16px', background: 'linear-gradient(135deg,#F0D78C,#B8902F)', boxShadow: '0 0 24px rgba(217,180,86,.55)' }} />
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(18,18,20,0) 30%,rgba(18,18,20,.88))' }} />
        <div style={{ position: 'absolute', left: '20px', right: '20px', bottom: '18px', color: '#F4F2ED' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#D9B456' }}>
            {vm.authKicker}
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '31px', lineHeight: '1.05', marginTop: '6px' }}>
            {vm.authTitle}
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: '-22px', padding: '16px', borderRadius: '24px', background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid #E4E2DB', boxShadow: '0 18px 40px rgba(18,18,20,.10)', animation: 'rise .55s cubic-bezier(.2,.8,.2,1) .08s both' }}>
        <div role="tablist" style={{ position: 'relative', display: 'flex', padding: '4px', borderRadius: '16px', background: '#EFEDE7' }}>
          <div style={{ position: 'absolute', top: '4px', bottom: '4px', left: '4px', width: 'calc(50% - 4px)', borderRadius: '12px', background: '#121214', boxShadow: '0 4px 12px rgba(18,18,20,.22)', transition: 'transform .38s cubic-bezier(.3,1.3,.5,1)', transform: str(vm.modeX) }} />
          {list(vm.authModes).map((t, index) => (
            <div key={index} onClick={t?.tap} role="tab" style={{ position: 'relative', zIndex: '1', cursor: 'pointer', flex: '1', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', transition: 'color .3s', color: str(t?.fg) }}>
              <Val v={t?.label} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: '13.5px', color: '#6B6A70', margin: '14px 2px 0', lineHeight: '1.5' }}>
          {vm.authSub}
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '16px 2px 8px' }}>
          SEND CODE BY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px' }}>
          {list(vm.authMethods).map((t, index) => (
            <div key={index} className="mb-press-2" onClick={t?.tap} role="tab" style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '58px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 13px', transition: 'all .3s cubic-bezier(.2,.8,.2,1)', background: str(t?.cardBg), border: `1.5px solid ${t?.border ?? ''}`, boxShadow: str(t?.sh) }}>
              <span style={{ width: '32px', height: '32px', flex: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .3s', background: str(t?.iconBg) }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t?.iconFg} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t?.icon} />
                </svg>
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: str(t?.fg) }}>
                {t?.label}
              </span>
              {t?.on ? (
                <span style={{ position: 'absolute', top: '0', bottom: '0', width: '40%', background: 'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.22),rgba(255,255,255,0))', animation: 'shimmer 2.4s ease-in-out infinite' }} />
              ) : null}
            </div>
          ))}
        </div>
        {vm.isSignup ? (
          <div style={{ animation: 'rise .35s ease-out both' }}>
            <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '16px 2px 8px' }}>
              FULL NAME
            </label>
            <input className="authIn" aria-label="Full name" value={vm.authName ?? ''} onChange={vm.setAuthName} placeholder="Adaeze Okafor" style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: '0 15px', fontSize: '15px', transition: 'border-color .2s, box-shadow .2s' }} />
          </div>
        ) : null}
        <label style={{ display: 'block', fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '16px 2px 8px' }}>
          {vm.authLabel}
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#8A6A1C" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d={vm.authIcon} />
            </svg>
          </span>
          {vm.isPhone ? (
            <select aria-label="Country code" value={vm.authCc ?? ''} onChange={vm.setAuthCc} style={{ position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '104px', border: 'none', borderRight: '1px solid #E4E2DB', background: 'transparent', padding: '0 4px 0 34px', fontSize: '14.5px', fontWeight: '600', color: '#121214', cursor: 'pointer', zIndex: '2', appearance: 'none', WebkitAppearance: 'none' }}>
              {list(vm.ccList).map((cc, index) => (
                <option key={index} value={cc?.v ?? ''}>
                  {cc?.l}
                </option>
              ))}
            </select>
          ) : null}
          <input className="authIn" aria-label={vm.authLabel} type={vm.authType} value={vm.authValue ?? ''} onChange={vm.setAuthValue} placeholder={vm.authPh} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E4E2DB', padding: `0 15px 0 ${vm.authPadL ?? ''}`, fontSize: '15px', transition: 'border-color .2s, box-shadow .2s' }} />
          {vm.authValid ? (
            <span style={{ position: 'absolute', right: '12px', top: '50%', marginTop: '-12px', width: '24px', height: '24px', borderRadius: '12px', background: '#17704C', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pop .35s both' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          ) : null}
        </div>
        {vm.authErr ? (
          <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500', animation: 'rise .25s ease-out both' }}>
            {vm.authErr}
          </div>
        ) : null}
        <div onClick={vm.toggleKeep} role="switch" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', padding: '0 2px' }}>
          <span style={{ fontSize: '14px' }}>
            Keep me signed in
          </span>
          <span style={{ width: '44px', height: '26px', borderRadius: '13px', position: 'relative', transition: 'background .25s', background: str(vm.keepBg) }}>
            <span style={{ position: 'absolute', top: '2px', width: '22px', height: '22px', borderRadius: '11px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .3s cubic-bezier(.3,1.4,.5,1)', left: str(vm.keepX) }} />
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px', fontSize: '12px', color: '#6B6A70', animation: 'rise .5s ease-out .2s both' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#17704C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
        </svg>
        Codes expire in 10 minutes · we never share your contact
      </div>
      <div onClick={vm.switchMode} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '12px', fontSize: '13.5px', color: '#6B6A70' }}>
        {vm.switchText}{' '}
        <b style={{ color: '#8A6A1C' }}>
          {vm.switchLink}
        </b>
      </div>
    </div>
  );
}
