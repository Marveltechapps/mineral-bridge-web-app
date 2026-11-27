// Generated from the Claude Design page "Mineral Bridge Web v6" — keep markup and styles in sync with the design.
import type { ViewModel } from '../../../types/platform';
import { list, str } from '../../../lib/platform/view';
import { Val } from '../ui/Val';

export function SellerConfirmationScreen({ vm }: { vm: ViewModel }) {
  return (
    <div style={{ padding: '0', animation: 'fadeUp .45s cubic-bezier(.2,.8,.2,1) both' }}>
      {vm.sx?.on ? (
        <section aria-label="Sell journey" style={{ marginBottom: '16px', borderRadius: '20px', background: '#fff', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82' }}>
              {"SELL JOURNEY · "}{vm.sx?.ref}
            </span>
            <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 9px', borderRadius: '99px', background: str(vm.sx?.pillBg), color: str(vm.sx?.pillFg) }}>
              {vm.sx?.status}
            </span>
          </div>
          <div className="hs" style={{ display: 'flex', overflowX: 'auto', padding: '14px 8px 12px', scrollbarWidth: 'none' }}>
            {list(vm.sx?.steps).map((t, index) => (
              <button key={index} onClick={t?.tap} aria-current={t?.cur} title={t?.l} style={{ flex: '1 0 92px', minWidth: '92px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', border: 'none', background: 'none', padding: '0 4px', position: 'relative', cursor: 'pointer', fontFamily: 'inherit' }}>
                <span aria-hidden="true" style={{ position: 'absolute', top: '13px', left: 'calc(50% + 16px)', right: 'calc(-50% + 16px)', height: '2px', background: str(t?.line) }} />
                <span style={{ width: '28px', height: '28px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11.5px', fontWeight: '800', background: str(t?.dotBg), color: str(t?.dotFg), border: `2px solid ${t?.dotBd ?? ''}`, position: 'relative', zIndex: '1' }}>
                  <Val v={t?.n} />
                </span>
                <span style={{ fontSize: '11px', fontWeight: str(t?.fw), color: str(t?.fg), textAlign: 'center', lineHeight: '1.25' }}>
                  {t?.l}
                </span>
              </button>
            ))}
          </div>
          <div style={{ padding: '14px 16px 16px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span aria-hidden="true" style={{ width: '34px', height: '34px', flex: 'none', borderRadius: '17px', background: str(vm.sx?.iconBg), color: str(vm.sx?.iconFg), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={vm.sx?.icon} />
                </svg>
              </span>
              <div style={{ flex: '1', minWidth: '0' }}>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>
                  {vm.sx?.title}
                </div>
                <div style={{ fontSize: '12.5px', color: '#5B6B82', marginTop: '3px', lineHeight: '1.5' }}>
                  {vm.sx?.note}
                </div>
              </div>
            </div>
            {vm.sx?.hasSub ? (
              <div style={{ marginTop: '12px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '2px 14px' }}>
                {list(vm.sx?.sub).map((b, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: `1px solid ${b?.line ?? ''}` }}>
                    <span aria-hidden="true" style={{ width: '20px', height: '20px', flex: 'none', borderRadius: '10px', background: str(b?.bg), border: `1.5px solid ${b?.bd ?? ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {b?.done ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : null}
                    </span>
                    <span style={{ flex: '1', minWidth: '0', fontSize: '13px', fontWeight: str(b?.fw), color: str(b?.fg) }}>
                      {b?.l}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#5B6B82', flex: 'none' }}>
                      {b?.who}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
              {vm.sx?.you ? (
                <button className="authBtn" onClick={vm.sx?.youTap} style={{ height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', background: '#F2C94C', color: '#1F2A44', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                  {vm.sx?.youLabel}{" →"}
                </button>
              ) : null}
              {vm.sx?.cont ? (
                <button className="authBtn" onClick={vm.sx?.contTap} style={{ height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                  {vm.sx?.contLabel}{" →"}
                </button>
              ) : null}
              {vm.sx?.openCur ? (
                <button className="authBtn" onClick={vm.sx?.openCurTap} style={{ height: '46px', padding: '0 18px', borderRadius: '13px', border: 'none', background: '#1F2A44', color: '#fff', fontFamily: 'inherit', fontWeight: '800', fontSize: '14px', cursor: 'pointer' }}>
                  {vm.sx?.openCurLabel}{" →"}
                </button>
              ) : null}
            </div>
            {vm.sx?.demo ? (
              <div style={{ marginTop: '12px', padding: '12px', borderRadius: '14px', border: '1px dashed #CBD5E1', background: '#fff' }}>
                <div style={{ fontSize: '10.5px', fontWeight: '800', letterSpacing: '.8px', color: '#5B6B82' }}>
                  {"DEMO · STEP OWNED BY "}{vm.sx?.demoWho}
                </div>
                <button onClick={vm.runDemo} style={{ marginTop: '8px', width: '100%', height: '42px', borderRadius: '12px', border: 'none', background: '#F1F5F9', fontFamily: 'inherit', fontWeight: '700', fontSize: '13px', color: '#1F2A44', cursor: 'pointer' }}>
                  {vm.sx?.demoLabel}
                </button>
                {vm.sx?.canChanges ? (
                  <button onClick={vm.demoChanges} style={{ marginTop: '6px', width: '100%', height: '36px', border: 'none', background: 'none', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '700', color: '#8A5A06', cursor: 'pointer' }}>
                    Simulate: changes requested
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
      <div style={{ padding: '16px', borderRadius: '22px', background: '#1F2A44', color: '#F8FAFC' }}>
        <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#94A3B8' }}>
          {vm.ov?.id}
        </div>
        <div style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px' }}>
          {vm.ov?.title}
        </div>
        <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>
          {vm.ov?.qtyLine}
        </div>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        HOW YOU WANT TO BE PAID
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.scMethods).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {list(vm.scFields).map((f, index) => (
            <div key={index}>
              <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '0 4px 5px' }}>
                {f?.l}
              </label>
              <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px', borderColor: str(f?.border) }} />
              {f?.err ? (
                <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                  {f?.err}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        {"INSPECTION & PICKUP DATE"}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.scDays).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        TIME
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
        {list(vm.scSlots).map((c, index) => (
          <div key={index} onClick={c?.tap} role="radio" style={{ cursor: 'pointer', padding: '9px 13px', borderRadius: '99px', fontSize: '13px', fontWeight: '600', transition: 'background .2s', background: str(c?.bg), color: str(c?.fg), border: `1px solid ${c?.border ?? ''}` }}>
            {c?.label}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '10.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '20px 4px 8px' }}>
        LOCATION
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {list(vm.scAddr).map((f, index) => (
          <div key={index}>
            <label style={{ display: 'block', fontFamily: "'Inter',system-ui,sans-serif", fontWeight: '700', fontVariantNumeric: 'tabular-nums', fontSize: '9.5px', letterSpacing: '.8px', color: '#5B6B82', margin: '0 4px 5px' }}>
              {f?.l}
            </label>
            <input aria-label={f?.l} value={f?.v ?? ''} onChange={f?.set} style={{ width: '100%', height: '52px', borderRadius: '14px', background: '#fff', border: '1px solid #E2E8F0', padding: '0 15px', fontSize: '15px', borderColor: str(f?.border) }} />
            {f?.err ? (
              <div style={{ fontSize: '12px', color: '#B42318', margin: '5px 4px 0' }}>
                {f?.err}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '14px', padding: '13px 15px', borderRadius: '16px', background: '#1F2A44', color: '#F8FAFC', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F2C94C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: '1px' }}>
          <path d="M1 7h13v10H1zM14 10h4l3 3v4h-7M5 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
        </svg>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: '600' }}>
            Mineral Bridge inspects and collects
          </div>
          <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px', lineHeight: '1.45' }}>
            Our inspector visits this location at the chosen time. After the reports are approved and you are paid, our logistics partner collects the product from the same place.
          </div>
        </div>
      </div>
      <div style={{ marginTop: '14px' }}>
        <div onClick={vm.toggleScC1} role="checkbox" style={{ cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '16px', background: '#fff', border: '1px solid #E2E8F0' }}>
          <span style={{ width: '22px', height: '22px', flex: 'none', borderRadius: '7px', border: '1.5px solid #1F2A44', display: 'flex', alignItems: 'center', justifyContent: 'center', background: str(vm.scC1Bg) }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <span style={{ fontSize: '13.5px', lineHeight: '1.45' }}>
            The product will be ready at this location for inspection and pickup.
          </span>
        </div>
      </div>
      {vm.scErrList ? (
        <div role="alert" style={{ marginTop: '12px', padding: '11px 14px', borderRadius: '14px', background: '#FDECEA', color: '#B42318', fontSize: '13px', fontWeight: '500' }}>
          {vm.scErrList}
        </div>
      ) : null}
    </div>
  );
}
