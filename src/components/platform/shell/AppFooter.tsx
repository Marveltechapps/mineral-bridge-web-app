// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
/* eslint-disable @next/next/no-img-element */
import type { ViewModel } from '../../../types/platform';
import { list } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function AppFooter({ vm }: { vm: ViewModel }) {
  return (
    <footer style={{ background: '#0F172A', color: '#CBD5E1', marginTop: '12px' }}>
      <div className="wrap footGrid" style={{ paddingTop: '44px', paddingBottom: '22px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.2fr', gap: '36px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <img src="/assets/m4/mb-logo.png" alt="" style={{ width: '52px', height: '52px', borderRadius: '26px', objectFit: 'cover', display: 'block' }} />
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '18px', letterSpacing: '-.3px' }}>
              Mineral Bridge
            </span>
          </div>
          <p style={{ maxWidth: '300px', fontSize: '13px', lineHeight: '1.7', color: '#94A3B8' }}>
            Verified mineral trading for buyers and sellers. Every lot inspected, every payment escrow-protected, every shipment insured and tracked.
          </p>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>
            Buy
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {list(vm.web?.footCats).map((l, index) => (
              <button key={index} className="footLink" onClick={l?.tap}>
                {l?.name}
              </button>
            ))}
            <button className="footLink" onClick={vm.goCart}>
              Cart
            </button>
          </div>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>
            {"Sell & account"}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="footLink" onClick={vm.goSell}>
              Sell minerals
            </button>
            <button className="footLink" onClick={vm.web?.goSellOrders}>
              Track sell requests
            </button>
            <button className="footLink" onClick={vm.web?.goAuctions}>
              Auctions
            </button>
            <button className="footLink" onClick={vm.web?.goAccount}>
              My account
            </button>
            <button className="footLink" onClick={vm.web?.goHelp}>
              {"Help & support"}
            </button>
          </div>
        </div>
        {/* Demo / simulation helpers are only shown when DEV_TOOLS is enabled (see controller.ts). */}
        {vm.devTools ? (
          <div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>
              Demo tools
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#94A3B8', marginBottom: '12px' }}>
              Steps owned by Mineral Bridge, SGS or the logistics partner are simulated with labelled demo buttons.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={vm.web?.toggleRail} style={{ height: '36px', padding: '0 12px', border: '1px solid rgba(242,201,76,.45)', borderRadius: '10px', background: 'transparent', color: '#F2C94C', fontFamily: 'inherit', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                {vm.web?.railLabel}
              </button>
              <button onClick={vm.resetDemo} style={{ height: '36px', padding: '0 12px', border: '1px solid #334155', borderRadius: '10px', background: 'transparent', color: '#CBD5E1', fontFamily: 'inherit', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Reset demo data
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <div className="wrap" style={{ paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #1E293B', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#F2C94C' }}>
          Mineral Bridge Trading Promise
        </span>
        {list(vm.web?.promise).map((c, index) => (
          <span key={index} style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #334155', background: '#1E293B', color: '#E2E8F0', borderRadius: '20px', padding: '4px 10px', fontSize: '11.5px', fontWeight: '700' }}>
            <Val v={c?.label} />
          </span>
        ))}
      </div>
      <div className="wrap" style={{ paddingTop: '14px', paddingBottom: '14px', borderTop: '1px solid #1E293B' }}>
        <details style={{ fontSize: '12px', color: '#94A3B8' }}>
          <summary style={{ cursor: 'pointer', fontWeight: '700', color: '#CBD5E1' }}>
            Mineral photo credits · Wikimedia Commons
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '6px 18px', marginTop: '10px', lineHeight: '1.45' }}>
            {list(vm.web?.photoCredits).map((c, index) => (
              <span key={index}>
                <b style={{ color: '#E2E8F0' }}>
                  {c?.m}
                </b>
                {" · "}
                <a href={c?.href} target="_blank" rel="noopener" style={{ color: '#F2C94C' }}>
                  {c?.by}
                </a>
                {" · "}{c?.lic}{" · cropped"}
              </span>
            ))}
          </div>
        </details>
      </div>
      <div className="wrap" style={{ paddingTop: '18px', paddingBottom: '18px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: '#94A3B8' }}>
        <span>
          © 2026 Mineral Bridge Ltd. All rights reserved.
        </span>
        <span>
          Inspected lots · E-contracts · Escrow payments · Insured transport
        </span>
      </div>
    </footer>
  );
}
