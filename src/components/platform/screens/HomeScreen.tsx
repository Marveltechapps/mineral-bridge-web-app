// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function HomeScreen({ vm }: { vm: ViewModel }) {
  return (
    <div className="homeShell" style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <aside className="hide-xs sideCard railStick" style={{ gap: '0', maxHeight: 'calc(100vh - 134px)' }}>
        <div style={{ background: '#1F2A44', color: '#fff', padding: '13px 16px', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: '0' }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
          All categories
        </div>
        <nav aria-label="Mineral categories" style={{ flex: '1', minHeight: '0', overflowY: 'auto', padding: '6px 6px 2px', scrollbarWidth: 'thin' }}>
          {list(vm.web?.catTree).map((c, index) => (
            <div key={index} style={{ padding: '2px 0 8px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
              <button className="catLink" onClick={c?.tap} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '8px', borderRadius: '10px', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '800', color: '#1F2A44', textAlign: 'left', cursor: 'pointer' }}>
                <span aria-hidden="true" style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(c?.img), flexShrink: '0', boxShadow: '0 0 0 2px #FEF7E0' }} />
                <span style={{ flex: '1', minWidth: '0' }}>
                  {c?.name}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#6B4E05', background: '#FEF7E0', padding: '2px 7px', borderRadius: '99px' }}>
                  {c?.n}
                </span>
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', margin: '0 0 0 24px', paddingLeft: '8px', borderLeft: '2px solid #F1F5F9' }}>
                {list(c?.minerals).map((x, index2) => (
                  <button key={index2} className="catLink" onClick={x?.tap} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%', padding: '6px 8px', borderRadius: '8px', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '600', textAlign: 'left', cursor: 'pointer', color: str(x?.fg) }}>
                    <span style={{ minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {x?.name}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '700', flexShrink: '0', color: str(x?.nfg) }}>
                      {x?.n}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div style={{ borderTop: '1px solid #E2E8F0', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: '0' }}>
          <button onClick={vm.goBuy} style={{ width: '100%', height: '40px', borderRadius: '11px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
            Browse all lots
          </button>
          <button onClick={vm.goSell} style={{ width: '100%', height: '40px', borderRadius: '11px', border: '1.5px solid #B48811', background: '#FEF7E0', color: '#1F2A44', fontFamily: 'inherit', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
            Sell a mineral
          </button>
        </div>
      </aside>
      <div className="homeMain">
        <section>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: '#5B6B82' }}>
                WELCOME BACK
              </div>
              <h1 style={{ fontWeight: '800', fontSize: '26px', letterSpacing: '-.6px', marginTop: '2px' }}>
                {vm.userFirst}
              </h1>
            </div>
          </div>
          {vm.kycBanner ? (
            <button onClick={vm.goKycStatus} style={{ width: '100%', cursor: 'pointer', marginBottom: '12px', padding: '12px 14px', borderRadius: '14px', background: '#FEF7E0', border: '1px solid #F5DE95', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit', textAlign: 'left' }}>
              <span aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#B48811', flex: 'none' }} />
              <span style={{ flex: '1', fontSize: '13px', fontWeight: '700', color: '#6B4E05' }}>
                {vm.kycBannerText}
              </span>
              <span aria-hidden="true" style={{ color: '#6B4E05', fontWeight: '800' }}>
                ›
              </span>
            </button>
          ) : null}
          {vm.isGuest ? (
            <button onClick={vm.goSignup} style={{ width: '100%', cursor: 'pointer', marginBottom: '12px', padding: '12px 14px', borderRadius: '14px', background: '#FEF7E0', border: '1px solid #F5DE95', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'inherit', textAlign: 'left' }}>
              <span style={{ flex: '1', fontSize: '13px', fontWeight: '700', color: '#6B4E05' }}>
                You are browsing as a guest. Create an account to buy or sell.
              </span>
              <span aria-hidden="true" style={{ color: '#6B4E05', fontWeight: '800' }}>
                ›
              </span>
            </button>
          ) : null}
          <div className="mbHero" style={{ position: 'relative', containerType: 'inline-size', borderRadius: '22px', overflow: 'hidden', minHeight: '590px', background: 'radial-gradient(120% 95% at 50% 45%, #2D3B5E 0%, #1F2A44 46%, #0F172A 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 24px 40px' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundImage: 'radial-gradient(rgba(242,201,76,.14) 1px, transparent 1px)', backgroundSize: '22px 22px', opacity: '.55' }} />
            {list(vm.web?.collage).map((t, index) => (
              <button key={index} className={`heroTile ${t?.cls ?? ''}`} onClick={t?.tap} aria-label={`${t?.label ?? ''} lots`} style={{ position: 'absolute', left: str(t?.l), right: str(t?.r), top: str(t?.t), width: str(t?.s), height: str(t?.s), transform: `rotate(${t?.rot ?? ''})`, padding: '0', border: 'none', background: 'none', cursor: 'pointer', zIndex: '2' }}>
                <span aria-hidden="true" style={{ display: 'block', width: '100%', height: '100%', borderRadius: str(t?.rad), border: '3px solid rgba(255,255,255,.94)', boxShadow: '0 20px 40px -14px rgba(0,0,0,.75)', backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(t?.img), animation: `floatY ${t?.dur ?? ''} ease-in-out infinite ${t?.delay ?? ''}` }} />
                <span style={{ position: 'absolute', left: '50%', bottom: '-11px', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: '#F2C94C', color: '#1F2A44', fontSize: '11.5px', fontWeight: '800', padding: '3px 11px', borderRadius: '99px', boxShadow: '0 4px 10px -4px rgba(0,0,0,.55)' }}>
                  {t?.label}
                </span>
              </button>
            ))}
            <div style={{ position: 'relative', zIndex: '3', textAlign: 'center', maxWidth: 'min(440px, 46cqw)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: 'min(250px, 30cqw)', height: 'min(250px, 30cqw)', marginBottom: '18px' }}>
                <div aria-hidden="true" style={{ position: 'absolute', inset: '-46px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,201,76,.34), rgba(242,201,76,0) 64%)', animation: 'logoPulse 4s ease-in-out infinite' }} />
                <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px rgba(242,201,76,.6), 0 26px 54px -18px rgba(0,0,0,.8)', animation: 'floatY 6s ease-in-out infinite' }}>
                  <img src="/assets/m4/mb-logo.png" alt="Mineral Bridge" style={{ width: '90%', height: '90%', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2.2px', color: '#F2C94C' }}>
                INSPECTED · CERTIFIED · TRACKED
              </span>
              <h2 style={{ fontWeight: '800', fontSize: 'clamp(24px,2.7vw,34px)', letterSpacing: '-1px', lineHeight: '1.08', marginTop: '8px' }}>
                Verified minerals, from mine to delivery.
              </h2>
              <p style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: '1.55', marginTop: '8px' }}>
                Inspected lots with test reports, agreed quotations, e-contracts and insured delivery for buyers and sellers worldwide.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button className="authBtn" onClick={vm.goBuy} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', height: '58px', padding: '0 28px', borderRadius: '16px', border: 'none', background: '#F2C94C', color: '#1F2A44', fontFamily: 'inherit', fontSize: '17px', fontWeight: '900', letterSpacing: '.6px', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 14px 30px -12px rgba(242,201,76,.75)' }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Buy minerals
                </button>
                <button className="authBtn" onClick={vm.goSell} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', height: '58px', padding: '0 28px', borderRadius: '16px', border: 'none', background: '#fff', color: '#1F2A44', fontFamily: 'inherit', fontSize: '17px', fontWeight: '900', letterSpacing: '.6px', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 14px 30px -12px rgba(0,0,0,.6)' }}>
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A6508" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Sell minerals
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '5px 11px', borderRadius: '99px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)' }}>
                  {vm.web?.lotTotal}{" verified lots"}
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '5px 11px', borderRadius: '99px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)' }}>
                  5 categories
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', padding: '5px 11px', borderRadius: '99px', background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.18)' }}>
                  Escrow-protected payment
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="g3">
          {list(vm.web?.promos).map((p, index) => (
            <div key={index} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div aria-hidden="true" style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#FEF7E0', color: '#8A6508', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={p?.icon} />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '14.5px' }}>
                  {p?.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '2px' }}>
                  {p?.sub}
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="g2">
          <button className="lotCard" onClick={vm.goBuy} aria-label="Buy minerals" style={{ display: 'block', padding: '0', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', aspectRatio: '12/5', background: '#EFF6FF', cursor: 'pointer' }}>
            <img src="/assets/m4/banner-buy.png" alt="Buy minerals · Verified minerals, transparent pricing" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </button>
          <button className="lotCard" onClick={vm.goSell} style={{ position: 'relative', display: 'block', padding: '0', borderRadius: '18px', overflow: 'hidden', border: '1px solid #E2E8F0', aspectRatio: '12/5', background: '#1F2A44', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
            <span aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundImage: 'url("/assets/m4/gold-dust.png")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <span aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(95deg,rgba(15,23,42,.95) 0%,rgba(31,42,68,.78) 50%,rgba(31,42,68,.1) 90%)' }} />
            <span style={{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px', color: '#fff' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.6px', color: '#F2C94C' }}>
                SELL TO MINERAL BRIDGE
              </span>
              <span style={{ fontWeight: '800', fontSize: 'clamp(20px,2.2vw,28px)', letterSpacing: '-.6px', lineHeight: '1.1', marginTop: '6px', maxWidth: '320px' }}>
                Get a fair, agreed price for your minerals
              </span>
              <span style={{ fontSize: '12.5px', color: '#E2E8F0', marginTop: '6px', maxWidth: '320px', lineHeight: '1.45' }}>
                Inspection on site · paid before pickup
              </span>
              <span style={{ marginTop: '12px', alignSelf: 'flex-start', background: '#F2C94C', color: '#1F2A44', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '800' }}>
                Start selling →
              </span>
            </span>
          </button>
        </section>
        {vm.hasNeedYou ? (
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontWeight: '800', fontSize: '22px', letterSpacing: '-.5px', display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '5px', background: '#F2C94C', boxShadow: '0 0 0 4px #FEF7E0' }} />
                Needs your action
              </h2>
              <button onClick={vm.goOrders} style={{ border: 'none', background: 'none', fontFamily: 'inherit', color: '#8A6508', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                All orders →
              </button>
            </div>
            <div style={{ borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 16px' }}>
              {list(vm.needYou).map((n, index) => (
                <button key={index} onClick={n?.tap} style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', border: 'none', borderBottom: '1px solid #F1F5F9', background: 'none', fontFamily: 'inherit', textAlign: 'left', color: '#1F2A44' }}>
                  <span aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#B48811', flex: 'none' }} />
                  <span style={{ flex: '1', minWidth: '0' }}>
                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '700' }}>
                      {n?.action}
                    </span>
                    <span style={{ display: 'block', fontSize: '12px', color: '#5B6B82', marginTop: '2px' }}>
                      {n?.id}{" · "}{n?.title}
                    </span>
                  </span>
                  <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#8A6508' }}>
                    Open →
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}
        {list(vm.web?.homeSecs).map((g, index) => (
          <section key={index} aria-label={g?.name}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontWeight: '800', fontSize: '22px', letterSpacing: '-.5px' }}>
                  {g?.name}
                </h2>
                <span style={{ background: '#FEF7E0', color: '#6B4E05', fontWeight: '800', fontSize: '12px', padding: '5px 11px', borderRadius: '10px', border: '1px solid #F5DE95' }}>
                  {g?.count}
                </span>
              </div>
              <button onClick={g?.tap} style={{ border: 'none', background: 'none', fontFamily: 'inherit', color: '#8A6508', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                View all →
              </button>
            </div>
            <div className="pgrid">
              {list(g?.lots).map((x, index2) => (
                <button key={index2} className="lotCard" onClick={x?.tap} aria-label={`${x?.name ?? ''} · ${x?.qty ?? ''}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', minWidth: '0', padding: '0', textAlign: 'left', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44', opacity: str(x?.opacity) }}>
                  <span style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '1/1', backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(x?.img) }}>
                    {x?.off ? (
                      <span style={{ position: 'absolute', left: '10px', top: '10px', background: '#1F2A44', color: '#fff', fontSize: '10.5px', fontWeight: '800', letterSpacing: '.3px', padding: '3px 8px', borderRadius: '8px' }}>
                        SOLD OUT
                      </span>
                    ) : null}
                    {x?.hasLabTag ? (
                      <span style={{ position: 'absolute', left: '10px', top: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#17704C', color: '#fff', fontSize: '10.5px', fontWeight: '800', letterSpacing: '.3px', padding: '3px 8px', borderRadius: '8px' }}>
                        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        LAB TESTED
                      </span>
                    ) : null}
                    <span style={{ position: 'absolute', right: '8px', bottom: '8px', background: 'rgba(15,23,42,.8)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '6px' }}>
                      {x?.id}
                    </span>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '12px 12px 14px', flex: '1', minWidth: '0' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#5B6B82', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {x?.sub}
                    </span>
                    <span style={{ height: '2.56em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', fontSize: '13.5px', fontWeight: '700', lineHeight: '1.28' }}>
                      {x?.name}
                    </span>
                    <span style={{ alignSelf: 'flex-start', maxWidth: '100%', padding: '2px 8px', borderRadius: '99px', fontSize: '10.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', background: str(x?.labBg), color: str(x?.labFg) }}>
                      {x?.grade}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                      <span style={{ minWidth: '0', lineHeight: '1.25' }}>
                        <span style={{ display: 'block', fontSize: '14px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {x?.qty}
                        </span>
                        <span style={{ display: 'block', fontSize: '11.5px', color: '#5B6B82', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {x?.min}
                        </span>
                      </span>
                      <span aria-hidden="true" style={{ width: '30px', height: '30px', flexShrink: '0', borderRadius: '50%', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
        <section className="trustGrid" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '16px 20px' }}>
          {list(vm.web?.trust).map((t, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div aria-hidden="true" style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EFF6FF', color: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t?.icon} />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '13.5px' }}>
                  {t?.title}
                </div>
                <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '1px' }}>
                  {t?.sub}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <aside className="hide-rail railStick">
        <div style={{ background: 'linear-gradient(150deg,#1F2A44,#0F172A)', borderRadius: '16px', padding: '18px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F2C94C', color: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', flexShrink: '0' }}>
              <Val v={vm.pIni} />
            </span>
            <div style={{ minWidth: '0' }}>
              <div style={{ fontWeight: '800', fontSize: '15px' }}>
                {vm.web?.greet}
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {vm.pBiz}
              </div>
            </div>
          </div>
          {vm.signedIn ? (
            <button onClick={vm.goKycStatus} style={{ width: '100%', textAlign: 'left', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.14)', borderRadius: '12px', padding: '11px 13px', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                <span style={{ display: 'block', fontWeight: '800', fontSize: '13px' }}>
                  {vm.kycWord}
                </span>
                <span style={{ display: 'block', fontSize: '11.5px', color: '#CBD5E1' }}>
                  {vm.web?.kycSub}
                </span>
              </span>
              <span aria-hidden="true">
                ›
              </span>
            </button>
          ) : null}
          <button className="authBtn" onClick={vm.web?.railCta} style={{ width: '100%', marginTop: '12px', height: '42px', borderRadius: '11px', background: '#F2C94C', color: '#1F2A44', border: 'none', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
            {vm.web?.railCtaLabel}
          </button>
        </div>
        {vm.signedIn ? (
          <div className="sideCard" style={{ padding: '14px' }}>
            <div style={{ fontWeight: '800', fontSize: '15px', margin: '2px 2px 10px' }}>
              Your activity
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '8px' }}>
              {list(vm.homeStats).map((h, index) => (
                <button key={index} onClick={h?.tap} style={{ border: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '12px', padding: '10px 8px', textAlign: 'left', fontFamily: 'inherit', color: '#1F2A44', cursor: 'pointer' }}>
                  <span style={{ display: 'block', fontSize: '20px', fontWeight: '800' }}>
                    {h?.n}
                  </span>
                  <span style={{ display: 'block', fontSize: '11px', color: '#5B6B82', fontWeight: '600', lineHeight: '1.3', marginTop: '2px' }}>
                    {h?.l}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {vm.web?.track ? (
          <div className="sideCard" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ fontWeight: '800', fontSize: '15px' }}>
                {vm.web?.track?.h}
              </div>
              <button onClick={vm.goOrders} style={{ border: 'none', background: 'none', fontFamily: 'inherit', color: '#8A6508', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                View all
              </button>
            </div>
            <button onClick={vm.web?.track?.tap} style={{ width: '100%', textAlign: 'left', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '13px', background: '#fff', fontFamily: 'inherit', color: '#1F2A44', cursor: 'pointer' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '99px', background: str(vm.web?.track?.pillBg), color: str(vm.web?.track?.pillFg) }}>
                  {vm.web?.track?.status}
                </span>
                <span style={{ fontSize: '11px', color: '#5B6B82', fontWeight: '600' }}>
                  {vm.web?.track?.id}
                </span>
              </span>
              <span style={{ display: 'block', fontSize: '13.5px', fontWeight: '700', marginTop: '8px' }}>
                {vm.web?.track?.title}
              </span>
              <span aria-hidden="true" style={{ display: 'block', height: '5px', borderRadius: '5px', background: '#F1F5F9', margin: '8px 0', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '5px', borderRadius: '5px', background: 'linear-gradient(90deg,#1F2A44,#F2C94C)', width: str(vm.web?.track?.pct) }} />
              </span>
              <span style={{ display: 'block', fontSize: '12px', color: '#5B6B82', lineHeight: '1.45' }}>
                {vm.web?.track?.next}
              </span>
              <span style={{ display: 'block', marginTop: '8px', fontSize: '12.5px', fontWeight: '800', color: '#8A6508' }}>
                Track →
              </span>
            </button>
          </div>
        ) : null}
        <div className="sideCard" style={{ padding: '18px' }}>
          <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>
            Need help?
          </div>
          <p style={{ fontSize: '12px', color: '#5B6B82', marginBottom: '12px' }}>
            Operations team · Mon–Sat, 08:00–18:00 WAT
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px', fontWeight: '700' }}>
            <button onClick={vm.web?.goHelp} style={{ display: 'flex', alignItems: 'center', gap: '9px', border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '700', color: '#8A6508', textAlign: 'left', cursor: 'pointer' }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Chat, WhatsApp or email
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: '9px', color: '#334155' }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
              </svg>
              +234 1 700 6400
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
