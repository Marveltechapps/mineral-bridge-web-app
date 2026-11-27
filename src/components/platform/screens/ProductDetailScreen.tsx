// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function ProductDetailScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontSize: '12.5px', color: '#5B6B82', marginBottom: '14px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <button onClick={vm.back} aria-label="Back" style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '17px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1F2A44', marginRight: '4px' }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button onClick={vm.web?.goHome} style={{ border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '12.5px', color: '#5B6B82', fontWeight: '600', cursor: 'pointer' }}>
          Home
        </button>
        <span aria-hidden="true" style={{ opacity: '.5' }}>
          /
        </span>
        <button onClick={vm.goBuy} style={{ border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '12.5px', color: '#5B6B82', fontWeight: '600', cursor: 'pointer' }}>
          Buy minerals
        </button>
        <span aria-hidden="true" style={{ opacity: '.5' }}>
          /
        </span>
        <button onClick={vm.web?.goLotsOfP} style={{ border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '12.5px', color: '#5B6B82', fontWeight: '600', cursor: 'pointer' }}>
          {vm.p?.mineral}
        </button>
        <span aria-hidden="true" style={{ opacity: '.5' }}>
          /
        </span>
        <b style={{ color: '#1F2A44' }}>
          {vm.p?.name}
        </b>
      </div>
      <div className="pdp">
        <div style={{ minWidth: '0' }}>
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#EFF6FF', aspectRatio: '4/3' }}>
            <div role="img" aria-label={vm.p?.name} style={{ position: 'absolute', inset: '0', backgroundSize: str(vm.web?.pdpMain?.size), backgroundPosition: str(vm.web?.pdpMain?.pos), transform: str(vm.web?.pdpMain?.flip), backgroundImage: str(vm.p?.img) }} />
            {vm.p?.hasLab ? (
              <span style={{ position: 'absolute', left: '14px', top: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#17704C', color: '#fff', fontSize: '11.5px', fontWeight: '800', padding: '5px 10px', borderRadius: '9px' }}>
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {"Tested by "}<Val v={vm.p?.lab} />
              </span>
            ) : null}
            {vm.p?.off ? (
              <span style={{ position: 'absolute', left: '14px', top: '14px', background: '#1F2A44', color: '#fff', fontSize: '11.5px', fontWeight: '800', padding: '5px 10px', borderRadius: '9px' }}>
                SOLD OUT
              </span>
            ) : null}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px', marginTop: '10px' }}>
            {list(vm.web?.pdpThumbs).map((t, index) => (
              <button key={index} onClick={t?.tap} aria-label={t?.label} aria-pressed={t?.on} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', padding: '0', cursor: 'pointer', background: '#EFF6FF', border: `2px solid ${t?.bd ?? ''}` }}>
                <span aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundSize: str(t?.size), backgroundPosition: str(t?.pos), transform: str(t?.flip), backgroundImage: str(vm.p?.img) }} />
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '10px', marginTop: '14px' }}>
            {list(vm.web?.pdpTrust).map((t, index) => (
              <div key={index} style={{ border: '1px solid #E2E8F0', background: '#fff', borderRadius: '12px', padding: '11px 12px', display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span aria-hidden="true" style={{ color: '#8A6508', flexShrink: '0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t?.icon} />
                  </svg>
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.3' }}>
                  {t?.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ minWidth: '0' }}>
          <div style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '.8px', color: '#8A6508', textTransform: 'uppercase' }}>
            {vm.p?.mineral}{" · "}{vm.p?.form}{" · "}{vm.p?.id}
          </div>
          <h1 style={{ fontWeight: '800', fontSize: '30px', letterSpacing: '-.8px', lineHeight: '1.12', marginTop: '8px' }}>
            {vm.p?.name}
          </h1>
          <div style={{ fontSize: '13.5px', color: '#5B6B82', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
            <Val v={vm.p?.origin} />
          </div>
          <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '12px', background: '#FEF7E0', border: '1px solid #F5DE95', fontSize: '13px', color: '#6B4E05', fontWeight: '600', lineHeight: '1.45' }}>
            Price is confirmed by quotation · No payment is taken when you order
          </div>
          {vm.p?.off ? (
            <div role="alert" style={{ marginTop: '14px', padding: '13px 15px', borderRadius: '16px', background: '#FDECEA', color: '#B42318', fontSize: '13.5px', fontWeight: '600' }}>
              {"This lot is sold out. Choose another lot of "}{vm.p?.mineral}.
            </div>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', marginTop: '14px' }}>
            <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0', padding: '14px' }}>
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
                AVAILABLE
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>
                {vm.p?.qty}
              </div>
            </div>
            {vm.p?.hasLab ? (
              <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0', padding: '14px' }}>
                <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
                  PURITY
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '6px' }}>
                  {vm.p?.grade}
                </div>
              </div>
            ) : null}
            {vm.p?.noLab ? (
              <div style={{ borderRadius: '18px', background: '#fff', border: '1px solid #E2E8F0', padding: '14px' }}>
                <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82' }}>
                  PURITY
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', marginTop: '6px', color: '#5B6B82' }}>
                  On request
                </div>
              </div>
            ) : null}
          </div>
          {vm.p?.on ? (
            <>
              <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
                QUANTITY TO ORDER
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input aria-label="Quantity" inputMode="decimal" value={vm.qty ?? ''} onChange={vm.setQty} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px', flex: '1' }} />
                {vm.noUnitPick ? (
                  <span style={{ width: '58px', height: '52px', flex: 'none', borderRadius: '14px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '14px' }}>
                    <Val v={vm.p?.unit} />
                  </span>
                ) : null}
              </div>
              {vm.unitPick ? (
                <>
                  <div role="radiogroup" aria-label="Unit" style={{ display: 'flex', gap: '3px', padding: '4px', borderRadius: '14px', background: '#E2E8F0', marginTop: '8px' }}>
                    {list(vm.qtyUnits).map((u, index) => (
                      <div key={index} onClick={u?.tap} role="radio" style={{ cursor: 'pointer', flex: '1', height: '38px', borderRadius: '11px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background .2s', background: str(u?.bg), color: str(u?.fg) }}>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>
                          {u?.label}
                        </span>
                        <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', opacity: '.7' }}>
                          {u?.short}
                        </span>
                      </div>
                    ))}
                  </div>
                  {vm.qtyEquiv ? (
                    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '12px', color: '#334155', margin: '8px 4px 0' }}>
                      {vm.qtyEquiv}
                    </div>
                  ) : null}
                </>
              ) : null}
              <div style={{ fontSize: '12px', color: '#5B6B82', margin: '7px 4px 0' }}>
                {"Minimum order "}{vm.minShown}{" · up to "}{vm.maxShown}{" · price is confirmed by quotation"}
              </div>
              {vm.inCartNote ? (
                <div style={{ fontSize: '12px', color: '#8A6508', fontWeight: '600', margin: '5px 4px 0' }}>
                  {vm.inCartNote}
                </div>
              ) : null}
              {vm.qtyErr ? (
                <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
                  {vm.qtyErr}
                </div>
              ) : null}
            </>
          ) : null}
          {vm.m?.cta ? (
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button className="authBtn" onClick={vm.primary} style={{ flex: '1 1 220px', height: '52px', borderRadius: '13px', background: '#1F2A44', color: '#fff', border: 'none', fontFamily: 'inherit', fontWeight: '800', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', cursor: 'pointer', opacity: str(vm.m?.ctaOpacity) }}>
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
                </svg>
                <Val v={vm.m?.cta} />
              </button>
              <button onClick={vm.goCart} style={{ height: '52px', padding: '0 20px', borderRadius: '13px', border: '1.5px solid #E2E8F0', background: '#fff', fontFamily: 'inherit', fontWeight: '700', fontSize: '14px', color: '#1F2A44', cursor: 'pointer' }}>
                View cart
              </button>
            </div>
          ) : null}
          <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '10px', lineHeight: '1.5' }}>
            Mineral Bridge reviews the order and sends a quotation. You pay only after you accept it and both sides sign the e-contract.
          </div>
          {vm.p?.hasLab ? (
            <>
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
                {"TESTING & CERTIFICATION"}
              </div>
              <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
                  <span style={{ color: '#5B6B82' }}>
                    Testing company
                  </span>
                  <span style={{ fontWeight: '600', textAlign: 'right' }}>
                    {vm.p?.lab}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 0', fontSize: '13.5px' }}>
                  <span style={{ color: '#5B6B82' }}>
                    Certificate no.
                  </span>
                  <span style={{ fontWeight: '600', textAlign: 'right' }}>
                    <span style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                      {vm.p?.cert}
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
                {"TEST REPORTS & CERTIFICATES"}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 15px' }}>
                  {list(vm.pDocs).map((d, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5" />
                        </svg>
                      </span>
                      <div onClick={d?.tap} role="button" style={{ cursor: 'pointer', flex: '1', minWidth: '0' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {d?.n}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#5B6B82', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {d?.f}
                        </div>
                      </div>
                      <div onClick={d?.tap} role="button" aria-label="Preview" style={{ cursor: 'pointer', width: '34px', height: '34px', flex: 'none', borderRadius: '11px', border: '1px solid #E2E8F0', color: '#1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                      <div onClick={d?.dl} role="button" aria-label="Download" style={{ cursor: 'pointer', width: '34px', height: '34px', flex: 'none', borderRadius: '11px', background: '#1F2A44', color: '#F2C94C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {vm.p?.noLab ? (
            <div style={{ marginTop: '14px', padding: '13px 15px', borderRadius: '16px', background: '#F1F5F9', fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
              No third-party test report for this lot yet. Ask Mineral Bridge for quality details before you order.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
