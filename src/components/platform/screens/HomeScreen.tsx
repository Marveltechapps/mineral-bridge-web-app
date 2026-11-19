// Generated from the Claude Design page "Mineral Bridge Web v5" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';

export function HomeScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 4px' }}>
        <div style={{ flex: '1', minWidth: '0' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90' }}>
            WELCOME BACK
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', lineHeight: '1.1', marginTop: '2px' }}>
            {vm.userFirst}
          </div>
        </div>
      </div>
      {vm.kycBanner ? (
        <div onClick={vm.goKycStatus} role="button" style={{ cursor: 'pointer', marginTop: '14px', padding: '12px 14px', borderRadius: '16px', background: '#FBF3E4', border: '1px solid #EFDDB8', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#A1620B', flex: 'none' }} />
          <span style={{ flex: '1', fontSize: '13px', fontWeight: '600', color: '#7A4A08' }}>
            {vm.kycBannerText}
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      ) : null}
      {vm.isGuest ? (
        <div onClick={vm.goSignup} role="button" style={{ cursor: 'pointer', marginTop: '14px', padding: '12px 14px', borderRadius: '16px', background: '#FBF3E4', border: '1px solid #EFDDB8', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ flex: '1', fontSize: '13px', fontWeight: '600', color: '#7A4A08' }}>
            You are browsing as a guest. Create an account to buy or sell.
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      ) : null}
      <div style={{ marginTop: '14px', borderRadius: '26px', overflow: 'hidden', position: 'relative', height: '228px', backgroundImage: 'url("/assets/m4/gold-bullion.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(18,18,20,.15),rgba(18,18,20,.86))' }} />
        <div style={{ position: 'absolute', left: '18px', right: '18px', bottom: '16px', color: '#F4F2ED' }}>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#D9B456' }}>
            INSPECTED · CERTIFIED · TRACKED
          </div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', lineHeight: '1.05', marginTop: '6px' }}>
            Verified minerals, from mine to delivery.
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
            <div onClick={vm.goBuy} role="button" style={{ cursor: 'pointer', flex: '1', height: '44px', borderRadius: '14px', background: '#D9B456', color: '#121214', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
              Buy minerals
            </div>
            <div onClick={vm.goSell} role="button" style={{ cursor: 'pointer', flex: '1', height: '44px', borderRadius: '14px', background: 'rgba(244,242,237,.14)', border: '1px solid rgba(244,242,237,.3)', color: '#F4F2ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
              Sell minerals
            </div>
          </div>
        </div>
      </div>
      {vm.m?.tabs ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '8px', marginTop: '12px' }}>
          {list(vm.homeStats).map((h, index) => (
            <div key={index} onClick={h?.tap} role="button" style={{ cursor: 'pointer', borderRadius: '18px', background: '#fff', border: '1px solid #E4E2DB', padding: '13px 12px' }}>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '22px', fontWeight: '600' }}>
                {h?.n}
              </div>
              <div style={{ fontSize: '11.5px', color: '#6B6A70', marginTop: '3px', lineHeight: '1.3' }}>
                {h?.l}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {vm.hasNeedYou ? (
        <>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '22px 4px 8px' }}>
            NEEDS YOUR ACTION
          </div>
          <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E4E2DB', padding: '2px 15px' }}>
            {list(vm.needYou).map((n, index) => (
              <div key={index} onClick={n?.tap} role="button" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 0', borderBottom: '1px solid #EFEDE7' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#D9B456', flex: 'none' }} />
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600' }}>
                    {n?.action}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B6A70', marginTop: '2px' }}>
                    {n?.id}{" · "}{n?.title}
                  </div>
                </div>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0AEA7" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: '10.5px', letterSpacing: '.8px', color: '#8B8A90', margin: '22px 4px 8px' }}>
        MINERAL CATEGORIES
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: '8px' }}>
        {list(vm.homeCats).map((c, index) => (
          <div key={index} className="mb-press-2" onClick={c?.tap} role="button" style={{ transition: 'transform .12s', cursor: 'pointer', height: '120px', borderRadius: '20px', overflow: 'hidden', position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(c?.img) }}>
            <div style={{ position: 'absolute', inset: '0', background: 'linear-gradient(180deg,rgba(18,18,20,0) 30%,rgba(18,18,20,.8))' }} />
            <div style={{ position: 'absolute', left: '12px', right: '12px', bottom: '10px', color: '#F4F2ED' }}>
              <div style={{ fontSize: '14px', fontWeight: '600' }}>
                {c?.name}
              </div>
              <div style={{ fontSize: '11.5px', opacity: '.8', marginTop: '2px' }}>
                {c?.n}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
