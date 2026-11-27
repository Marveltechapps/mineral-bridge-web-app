// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function LotsScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      <div style={{ fontSize: '12.5px', color: '#5B6B82', marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
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
        <button onClick={vm.web?.goLotCat} style={{ border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '12.5px', color: '#5B6B82', fontWeight: '600', cursor: 'pointer' }}>
          {vm.web?.lotCatName}
        </button>
        <span aria-hidden="true" style={{ opacity: '.5' }}>
          /
        </span>
        <b style={{ color: '#1F2A44' }}>
          {vm.web?.lotMinName}
        </b>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={vm.back} aria-label="Back" style={{ width: '40px', height: '40px', flex: 'none', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1F2A44' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 style={{ fontWeight: '800', fontSize: '28px', letterSpacing: '-.7px', lineHeight: '1.1' }}>
              {vm.web?.lotMinName}
            </h1>
            <div style={{ fontSize: '13px', color: '#5B6B82', marginTop: '3px' }}>
              {vm.lotNum}{' '}{vm.lotWord}{" · inspected, tested and tracked"}
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ height: '42px', borderRadius: '11px', background: '#fff', border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', width: '230px' }}>
            <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#5B6B82" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
            <input aria-label="Search these lots" value={vm.search ?? ''} onChange={vm.setSearch} placeholder="Search these lots" style={{ flex: '1', minWidth: '0', border: 'none', background: 'transparent', fontSize: '13.5px' }} />
            {vm.search ? (
              <button onClick={vm.clearSearch} style={{ border: 'none', background: 'none', fontFamily: 'inherit', cursor: 'pointer', fontSize: '12px', fontWeight: '700', color: '#5B6B82' }}>
                Clear
              </button>
            ) : null}
          </div>
          <span style={{ fontSize: '13px', color: '#5B6B82', fontWeight: '600' }}>
            Sort by
          </span>
          <button onClick={vm.toggleSort} aria-haspopup="listbox" aria-expanded={vm.web?.sortExp} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '42px', padding: '0 12px 0 14px', borderRadius: '11px', background: '#fff', border: '1.5px solid #E2E8F0', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '700', color: '#1F2A44', cursor: 'pointer' }}>
            <Val v={vm.sortLabel} />
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#5B6B82" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform .2s', transform: str(vm.sortChevron) }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {vm.sortOpen ? (
            <div role="listbox" style={{ position: 'absolute', right: '0', top: '50px', zIndex: '20', width: '220px', padding: '6px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', boxShadow: '0 14px 34px rgba(15,23,42,.16)', animation: 'fadeUp .2s ease-out both' }}>
              {list(vm.sorts).map((t, index) => (
                <button key={index} className="mb-hover-1" onClick={t?.tap} role="option" style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '40px', padding: '0 12px', border: 'none', borderRadius: '10px', background: 'transparent', fontFamily: 'inherit', fontSize: '13.5px', color: '#1F2A44', fontWeight: str(t?.weight) }}>
                  <Val v={t?.label} />
                  {t?.on ? (
                    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A6508" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="catShell">
        <aside className="railStick" style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '14px', gap: '0' }}>
          <div style={{ fontWeight: '800', fontSize: '14px', padding: '2px 4px 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A6508" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
            </svg>
            <Val v={vm.web?.lotCatName} />
          </div>
          <nav aria-label="Minerals" style={{ display: 'flex', flexDirection: 'column', gap: '2px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '14px' }}>
            {list(vm.web?.lotRail).map((r, index) => (
              <button key={index} onClick={r?.tap} aria-current={r?.cur} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '9px', width: '100%', padding: '8px 9px', borderRadius: '9px', border: 'none', fontFamily: 'inherit', fontSize: '12.5px', textAlign: 'left', cursor: 'pointer', fontWeight: str(r?.fw), color: str(r?.fg), background: str(r?.bg) }}>
                <Val v={r?.name} />
                <span style={{ fontSize: '11px', color: '#5B6B82' }}>
                  {r?.n}
                </span>
              </button>
            ))}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
            <span style={{ fontWeight: '800', fontSize: '15px' }}>
              Filters
            </span>
            {vm.web?.hasFilters ? (
              <button onClick={vm.resetFilters} style={{ border: 'none', background: 'none', fontFamily: 'inherit', color: '#B42318', fontWeight: '700', fontSize: '12.5px', cursor: 'pointer' }}>
                Clear all
              </button>
            ) : null}
          </div>
          <div role="radiogroup" aria-label="Form" style={{ marginBottom: '16px', padding: '0 4px' }}>
            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}>
              Form
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {list(vm.web?.formRadios).map((c, index) => (
                <button key={index} onClick={c?.tap} role="radio" aria-checked={c?.on} style={{ display: 'flex', alignItems: 'center', gap: '9px', border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', color: '#1F2A44', textAlign: 'left', cursor: 'pointer' }}>
                  <span aria-hidden="true" style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #1F2A44', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: str(c?.dot) }} />
                  </span>
                  <Val v={c?.label} />
                </button>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid #E2E8F0', padding: '16px 4px 2px' }}>
            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}>
              Testing
            </div>
            <button onClick={vm.toggleLab} role="checkbox" aria-checked={vm.web?.labOn} style={{ display: 'flex', alignItems: 'center', gap: '9px', border: 'none', background: 'none', padding: '0', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', color: '#1F2A44', cursor: 'pointer', textAlign: 'left' }}>
              <span aria-hidden="true" style={{ width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid #1F2A44', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', background: str(vm.labChipBg), color: '#F2C94C', fontSize: '11px', fontWeight: '800' }}>
                <Val v={vm.web?.labMark} />
              </span>
              Has third-party test report
            </button>
          </div>
        </aside>
        <div style={{ minWidth: '0' }}>
          <div style={{ position: 'relative', borderRadius: '16px', marginBottom: '18px', overflow: 'hidden', minHeight: '200px', display: 'flex', alignItems: 'stretch', background: '#1F2A44' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: '0', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: str(vm.web?.lotImg) }} />
            <div aria-hidden="true" style={{ position: 'absolute', inset: '0', background: 'linear-gradient(95deg,rgba(15,23,42,.95) 0%,rgba(31,42,68,.8) 42%,rgba(31,42,68,.18) 72%,rgba(31,42,68,.05) 100%)' }} />
            <div style={{ position: 'relative', padding: '26px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px', color: '#fff', maxWidth: '620px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '1.4px', color: '#F2C94C', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
                </svg>
                THIRD-PARTY TESTED LOTS
              </div>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#CBD5E1', marginTop: '10px' }}>
                {vm.web?.lotCatName}
              </div>
              <div style={{ fontWeight: '800', fontSize: 'clamp(28px,3.2vw,38px)', letterSpacing: '-1px', lineHeight: '1.05' }}>
                {vm.web?.lotMinName}{" lots"}
              </div>
              <div style={{ fontSize: '14px', color: '#E2E8F0', marginTop: '8px', maxWidth: '440px', lineHeight: '1.5' }}>
                Every lot lists its origin, form and test report. The price is confirmed by quotation after you order.
              </div>
              <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap', marginTop: '16px' }}>
                <span style={{ background: '#F2C94C', color: '#1F2A44', padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '800' }}>
                  {vm.lotNum}{' '}{vm.lotWord}
                </span>
                <span style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.3)', padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700' }}>
                  Escrow-protected payment
                </span>
                <span style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.3)', padding: '7px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700' }}>
                  Insured transport
                </span>
              </div>
            </div>
          </div>
          <div className="pgrid">
            {list(vm.lots).map((x, index) => (
              <button key={index} className="lotCard" onClick={x?.tap} aria-label={`${x?.name ?? ''} · ${x?.qty ?? ''}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', minWidth: '0', padding: '0', textAlign: 'left', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', fontFamily: 'inherit', color: '#1F2A44', opacity: str(x?.opacity) }}>
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
          {vm.noLots ? (
            <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '50px 20px', textAlign: 'center' }}>
              <div style={{ fontWeight: '800', fontSize: '17px' }}>
                {vm.lotsEmptyText}
              </div>
              <p style={{ color: '#5B6B82', fontSize: '13.5px', marginTop: '6px' }}>
                Clear filters or check back soon.
              </p>
              <button onClick={vm.resetFilters} style={{ marginTop: '16px', background: '#1F2A44', color: '#fff', border: 'none', fontFamily: 'inherit', fontWeight: '700', padding: '11px 22px', borderRadius: '12px', cursor: 'pointer' }}>
                Reset filters
              </button>
            </div>
          ) : null}
        </div>
        <aside className="hide-rail railStick">
          <div style={{ background: 'linear-gradient(150deg,#1F2A44,#0F172A)', borderRadius: '16px', padding: '20px', color: '#fff' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.2px', color: '#F2C94C' }}>
              SELL TO MINERAL BRIDGE
            </div>
            <div style={{ fontWeight: '800', fontSize: '20px', letterSpacing: '-.4px', marginTop: '6px', lineHeight: '1.15' }}>
              {"Have "}{vm.web?.lotMinName}{" to sell?"}
            </div>
            <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '6px', lineHeight: '1.5' }}>
              Get a quotation, inspection on site and payment before pickup.
            </div>
            <button className="authBtn" onClick={vm.web?.sellThis} style={{ width: '100%', marginTop: '14px', height: '42px', borderRadius: '11px', background: '#F2C94C', color: '#1F2A44', border: 'none', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
              Start a sell request
            </button>
          </div>
          <div className="sideCard" style={{ padding: '18px' }}>
            <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '14px' }}>
              Why buy on Mineral Bridge?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {list(vm.web?.whyBuy).map((t, index) => (
                <div key={index} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                  <span aria-hidden="true" style={{ color: '#8A6508', flexShrink: '0' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={t?.icon} />
                    </svg>
                  </span>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '13px' }}>
                      {t?.title}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#5B6B82' }}>
                      {t?.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sideCard" style={{ padding: '18px' }}>
            <div style={{ fontWeight: '800', fontSize: '15px', marginBottom: '4px' }}>
              Need help choosing?
            </div>
            <p style={{ fontSize: '12px', color: '#5B6B82', marginBottom: '12px' }}>
              Our trading desk can explain grades and test reports.
            </p>
            <button onClick={vm.web?.goHelp} style={{ width: '100%', height: '40px', borderRadius: '11px', border: '1.5px solid #E2E8F0', background: '#fff', fontFamily: 'inherit', fontWeight: '700', fontSize: '13px', color: '#1F2A44', cursor: 'pointer' }}>
              Contact Mineral Bridge
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
