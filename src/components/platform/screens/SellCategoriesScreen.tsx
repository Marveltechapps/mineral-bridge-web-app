// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import { Fragment } from 'react';
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function SellCategoriesScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div role="list" aria-label="Sell request steps" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', padding: '10px 14px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0' }}>
        {list(vm.web?.sellPre).map((t, index) => (
          <span key={index} role="listitem" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: str(t?.fw), color: str(t?.fg) }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '11px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', background: str(t?.bg), color: str(t?.dot), border: `1.5px solid ${t?.bd ?? ''}` }}>
              <Val v={t?.n} />
            </span>
            <Val v={t?.l} />
            {t?.arrow ? (
              <span aria-hidden="true" style={{ color: '#94A3B8', marginLeft: '2px' }}>
                ›
              </span>
            ) : null}
          </span>
        ))}
        <span style={{ fontSize: '12px', color: '#5B6B82', marginLeft: 'auto' }}>
          Then: review · price · e-contract · inspection · payment · pickup
        </span>
      </div>
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', minHeight: '200px', display: 'flex', alignItems: 'stretch', marginBottom: '18px', background: '#1F2A44' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url("/assets/m4/gold-dust.png")' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(95deg,rgba(15,23,42,.95) 0%,rgba(31,42,68,.82) 45%,rgba(31,42,68,.18) 82%)' }} />
        <div style={{ position: 'relative', padding: '28px 30px', color: '#fff', maxWidth: '640px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '1.4px', color: '#F2C94C' }}>
            SELL TO MINERAL BRIDGE
          </div>
          <div style={{ fontWeight: '800', fontSize: 'clamp(26px,3vw,36px)', letterSpacing: '-1px', lineHeight: '1.06', marginTop: '8px' }}>
            Choose the mineral you want to sell.
          </div>
          <div style={{ fontSize: '14px', color: '#E2E8F0', marginTop: '8px', lineHeight: '1.55', maxWidth: '480px' }}>
            Nothing is sold until you accept a price and sign the e-contract. Mineral Bridge inspects on site and pays you before pickup.
          </div>
        </div>
      </div>
      <div className="g3" style={{ marginBottom: '18px' }}>
        {list(vm.sellNext).map((n, index) => (
          <div key={index} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '15px 16px', display: 'flex', gap: '12px' }}>
            <span style={{ width: '30px', height: '30px', flex: 'none', borderRadius: '15px', background: '#1F2A44', color: '#F2C94C', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Val v={n?.n} />
            </span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px' }}>
                {n?.t}
              </div>
              <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '3px', lineHeight: '1.45' }}>
                {n?.b}
              </div>
            </div>
          </div>
        ))}
      </div>
      {vm.buyerOnly ? (
        <div style={{ marginBottom: '12px', padding: '12px 14px', borderRadius: '14px', background: '#FEF7E0', border: '1px solid #F5DE95', fontSize: '13px', color: '#6B4E05', lineHeight: '1.45' }}>
          Your account is set up for buying. You can prepare a sell request now and add a seller type when you submit.
        </div>
      ) : null}
      {vm.hasDraft ? (
        <div style={{ marginBottom: '12px', padding: '14px 16px', borderRadius: '16px', background: '#1F2A44', color: '#fff', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#F2C94C' }}>
              DRAFT SAVED
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', marginTop: '4px' }}>
              {vm.draftLine}
            </div>
          </div>
          <button onClick={vm.resumeDraft} style={{ height: '40px', padding: '0 16px', borderRadius: '11px', border: 'none', background: '#F2C94C', color: '#1F2A44', fontFamily: 'inherit', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
            Resume draft
          </button>
          <button onClick={vm.discardDraft} style={{ height: '40px', padding: '0 14px', borderRadius: '11px', border: '1px solid rgba(255,255,255,.3)', background: 'transparent', color: '#fff', fontFamily: 'inherit', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Discard
          </button>
        </div>
      ) : null}
      <div style={{ height: '48px', borderRadius: '13px', background: '#fff', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', maxWidth: '520px' }}>
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5B6B82" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input aria-label="Search minerals to sell" value={vm.search ?? ''} onChange={vm.setSearch} placeholder="Search minerals to sell" style={{ flex: '1', minWidth: '0', border: 'none', background: 'transparent', fontSize: '14.5px' }} />
        {vm.search ? (
          <button onClick={vm.clearSearch} style={{ border: 'none', background: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: '12.5px', fontWeight: '700', color: '#5B6B82' }}>
            Clear
          </button>
        ) : null}
      </div>
      {list(vm.sellGroups).map((g, index) => (
        <Fragment key={index}>
          <h2 style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-.3px', margin: '22px 2px 10px' }}>
            {g?.name}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '10px' }}>
            {list(g?.items).map((i, index2) => (
              <button key={index2} className="lotCard" onClick={i?.tap} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px', border: '1px solid #E2E8F0', borderRadius: '14px', background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44' }}>
                <span aria-hidden="true" style={{ width: '54px', height: '54px', borderRadius: '12px', backgroundColor: '#EFF6FF', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(i?.img), flexShrink: '0' }} />
                <span style={{ flex: '1', minWidth: '0' }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: '800' }}>
                    {i?.n}
                  </span>
                  <span style={{ display: 'block', fontSize: '12px', color: '#8A6508', fontWeight: '700', marginTop: '3px' }}>
                    Start sell request →
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Fragment>
      ))}
      {vm.sellNone ? (
        <div style={{ marginTop: '16px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0', padding: '24px', textAlign: 'center', fontSize: '14px', color: '#5B6B82' }}>
          No mineral matches “{vm.search}”.
        </div>
      ) : null}
    </div>
  );
}
